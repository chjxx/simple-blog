const MongoModel = require('../../lib/mongo');
const f = require('../../lib/file');
const utils = require('../../lib/utils');
const { ParamTypeError } = require('../../lib/ExtendError');
/**
 * 处理用户数据
 * @param  {Array|Object|MongooseDocument} user 账户，必填项
 * @param  {Array} reservedKeys 保留的属性，可选
 * @return {Array|Object}
 */
exports.treat = (result, reservedKeys) => {
  // 文档容器
  let images = [];

  // 统一文档格式，供后面数据处理
  if (utils.isType(result, 'Array')) {
    // 如果是MongooseDocument,则转为普通对象
    result = result.map(image => (image instanceof MongoModel.Image) ? image.toObject() : image);

    images = result;
  } else {
    // 如果是MongooseDocument,则转为普通对象
    result = (result instanceof MongoModel.Image) ? result.toObject() : result;

    images.push(result);
  }

  // 检查参数类型
  let paramError = utils.checkPropertyType({ images, reservedKeys }, {
    images: {
      expected: 'ObjectArray',
      test: (val) => val.every(image => utils.isType(image, 'Object'))
    },
    reservedKeys: 'Undefined|Array'
  });
  // 如果类型有错则报错
  if (paramError) {
    paramError.actualType = images.map(image => utils.getType(image)).join(',');

    throw new ParamTypeError(paramError);
  }
  // 保留的属性名
  reservedKeys = reservedKeys || ['owner', 'title', 'notes', 'album', 'filename'];
  // 删除多余的属性，处理需要处理的属性
  images.forEach(img => {
    Object.keys(img).forEach(key => {
      if (!reservedKeys.includes(key)) {
        delete img[key];
      } else if (key === 'filename' && img[key]) {
        img[key] = f.path.resolve.image.access.resource(img[key]);
      }
    });
  });

  return result;
};