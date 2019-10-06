const { ObjectId } = require('mongoose').Types;
const { Image } = require('../../lib/mongo');
const File = require('../../lib/file');
const { isType, notType, getType, checkPropertyType } = require('../../lib/utils');
const { ParamTypeError } = require('../../lib/ExtendError');
const errorHandler = require('./errorHandler');

/**
 * 创建一条图片信息
 * @param  {Object} doc 要创建的图片信息, 必填
 * @return {Promise}
 */
exports.create = (doc) => {
  let paramError = checkPropertyType({ doc }, {
    doc: 'Object|Array'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  return Image.create(doc).catch(errorHandler);
};

/**
 * 获取特定一组图片信息
 * @param  {Object} filter 筛选项, 必填
 * @param  {Object} options 对数据进一步筛选
 * @return {Promise}
 */
exports.get = (filter, options) => {
  let paramError = checkPropertyType({ filter }, {
    filter: 'Object',
    'filter.owner': {
      expected: 'String|MongooseObjectId',
      test: (val) => isType(val, 'String') || val instanceof ObjectId
    }
  });

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  let { offset, limit } = Object.assign({}, options);

  offset = offset || 0;
  limit = limit || 0;

  return Image.find(filter)
    .skip(offset)
    .limit(limit)
    .populate({
      path: 'owner',
      select: 'name'
    })
    .sort({
      created_at: -1
    })
    .catch(errorHandler);
};

/**
 * 更新图片信息
 * @param  {MongooseDocument} image 图片信息MongooseDocument, 必填
 * @param  {Object} doc 更新的图片信息, 必填
 * @return {Promise}
 */
exports.updateOne = (image, doc) => {
  let paramError = checkPropertyType({ image, doc }, {
    image: {
      expected: 'MongooseDocument',
      test: (val) => val instanceof Image
    },
    doc: 'Object'
  });

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  return image.updateOne(doc, { runValidators: true }).catch(errorHandler);
};

/**
 * 删除图片
 * @param  {MongooseDocumentArray|MongooseDocument} images 图片信息MongooseDocument, 必填
 * @return {Promise}
 */
exports.del = images => {
  if (notType(images, 'Array')) {
    images = [images];
  }

  let paramError = checkPropertyType({ images }, {
    images: {
      expected: 'MongooseDocumentArray',
      test: (val) => val.every(image => image instanceof Image)
    }
  });

  if (paramError) {
    paramError.actualType = images.map(image => getType(image)).join(',');

    return Promise.reject(new ParamTypeError(paramError));
  }

  let imagePromises = images.map(img => {
    return img.remove()
      .then(() => {
        return File.image.deleteResource(img.filename);
      }, errorHandler);
  });

  return Promise.all(imagePromises);
};
