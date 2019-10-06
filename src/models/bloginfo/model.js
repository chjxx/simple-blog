const { ObjectId } = require('mongoose').Types;
const { Bloginfo } = require('../../lib/mongo');
const File = require('../../lib/file');
const { isType, checkPropertyType } = require('../../lib/utils');
const {
  ModelResultError,
  ParamTypeError
} = require('../../lib/ExtendError');
const errorHandler = require('./errorHandler');

/**
 * 创建博客信息
 * @param  {Object} info 博客信息，可选
 * @return {Promise}
 */
exports.create = info => {
  info = Object.assign({}, info);

  return Bloginfo.create(info).catch(errorHandler);
};

/**
 * 获取博客信息
 * @return {Promise}
 */
exports.get = () => {
  return Bloginfo.findOne().then(bloginfo => {
    if (!bloginfo) {
      throw new ModelResultError('博客基础信息未初始化！');
    }

    return bloginfo;
  }, errorHandler);
};

/**
 * 更新博客信息
 * @param  {MongooseDocument} bloginfo 博客信息MongooseDocument，必填
 * @param  {Object} doc 博客信息修改的选项，必填
 * @return {Promise}
 */
exports.updateOne = (bloginfo, doc) => {
  let paramError = checkPropertyType(
    {
      bloginfo,
      doc
    },
    {
      bloginfo: {
        expected: 'MongooseDocument',
        test: val => val instanceof Bloginfo
      },
      doc: 'Object'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  return bloginfo.updateOne(doc, { runValidators: true }).then(
    result => {
      if (doc.logo && bloginfo.logo) {
        // 如果修改成功且有更新logo，则删除旧的logo文件
        doc.logo && File.image.deleteLogo(bloginfo.logo);
      }
    }, errorHandler);
};

/**
 * 添加博客管理员
 * @param  {Object} bloginfo 博客信息MongooseDocument，必填
 * @param  {Object} user 用户信息，必需带有_id选项, 必填项
 * @return {Promise}
 */
exports.pushAdmin = (bloginfo, user) => {
  let paramError = checkPropertyType(
    {
      bloginfo,
      user
    },
    {
      bloginfo: {
        expected: 'MongooseDocument',
        test: () => bloginfo instanceof Bloginfo
      },
      user: 'Object',
      'user._id': {
        expected: 'MongooseObjectId|string',
        test: val => val instanceof ObjectId || isType(val, 'String')
      }
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  return exports.updateOne(bloginfo, { $push: { admin: user._id } });
};

/**
 * 移除博客管理员
 * @param  {Object} bloginfo 博客信息MongooseDocument，必填
 * @param  {Object} user 用户信息，必需带有_id选项, 必填项
 * @return {Promise}
 */
exports.pullAdmin = (bloginfo, user) => {
  let paramError = checkPropertyType(
    {
      bloginfo,
      user
    },
    {
      bloginfo: {
        expected: 'MongooseDocument',
        test: () => bloginfo instanceof Bloginfo
      },
      user: 'Object',
      'user._id': {
        expected: 'MongooseObjectId|string',
        test: val => val instanceof ObjectId || isType(val, 'String')
      }
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  return exports.updateOne(bloginfo, { $pull: { admin: user._id } });
};
