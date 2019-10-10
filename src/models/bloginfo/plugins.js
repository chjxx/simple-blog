const { ObjectId } = require('mongoose').Types;
const { Bloginfo } = require('../../lib/mongo');
const f = require('../../lib/file');
const { ADMIN_MAXIMUM } = require('../../config');
const { isType, checkPropertyType } = require('../../lib/utils');
const { ModelResultError, ParamTypeError } = require('../../lib/ExtendError');

/**
 * 检查管理员人数上限
 * @param  {Object|MongooseDocument} bloginfo 博客信息, 带admin属性, 必填
 * @return {Object|Error}
 */
exports.checkAdminLimit = bloginfo => {
  let paramError = checkPropertyType({ bloginfo }, {
    bloginfo: 'Object',
    'bloginfo.admin': 'Array'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  if (bloginfo.admin.length < ADMIN_MAXIMUM) {
    // 如果人数未达上限
    return bloginfo;
  } else {
    // 如果人数已达上限
    throw new ModelResultError('管理人员数量已达上限！');
  }
};

/**
 * 检查某用户是否为管理员
 * @param  {Object|MongooseDocument} bloginfo 博客信息，带admin属性, 必填
 * @param  {Object|MongooseDocument} user 用户信息，带_id属性, 必填
 * @return {Object|Error}
 */
exports.checkAdmin = (bloginfo, user) => {
  let paramError = checkPropertyType({
    bloginfo,
    user
  }, {
    bloginfo: 'Object',
    'bloginfo.admin': 'Array',
    user: 'Object',
    'user._id': {
      expected: 'MongooseObjectId|string',
      test: (val) => val instanceof ObjectId || isType(val, 'String')
    }
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  let result = bloginfo.admin.some(
    userID => userID.toString() === user._id.toString()
  );

  if (result) {
    // 如果是管理员
    return bloginfo;
  } else {
    // 如果不是管理员
    throw new ModelResultError('非管理员账号！');
  }
};

/**
 * 检查某用户是否不是管理员
 * @param  {Object|MongooseDocument} bloginfo 博客信息，带admin属性, 必填
 * @param  {Object|MongooseDocument} user 用户信息，带_id属性, 必填
 * @return {Object|Error}
 */
exports.checkNotAdmin = (bloginfo, user) => {
  let paramError = checkPropertyType({
    bloginfo,
    user
  }, {
    bloginfo: 'Object',
    'bloginfo.admin': 'Array',
    user: 'Object',
    'user._id': {
      expected: 'MongooseObjectId|string',
      test: (val) => val instanceof ObjectId || isType(val, 'String')
    }
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  let result = bloginfo.admin.some(
    userID => userID.toString() === user._id.toString()
  );

  if (result) {
    // 如果是管理员
    throw new ModelResultError('该账号为管理员账号！');
  } else {
    // 如果不是管理员
    return bloginfo;
  }
};

/**
 * 处理博客信息字段
 * @param  {Object} bloginfo 博客信息, 必填
 * @param  {Array} reservedKeys 保留的属性，可选
 * @return {Object}
 */
exports.treat = (bloginfo, reservedKeys) => {
  let paramError = checkPropertyType({ bloginfo, reservedKeys }, {
    bloginfo: 'Object',
    reservedKeys: 'Undefined|Array'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  if (bloginfo instanceof Bloginfo) {
    bloginfo = bloginfo.toObject();
  }

  reservedKeys = reservedKeys || ['name', 'logo', 'about', 'blogroll', 'contacts', 'filling'];

  Object.keys(bloginfo).forEach(key => {
    if (!reservedKeys.includes(key)) {
      delete bloginfo[key];
    } else if (key === 'logo' && bloginfo[key]) {
      bloginfo[key] = f.image.resolveLogoPath(bloginfo[key]);
    }
  });

  return bloginfo;
};