const bcrypt = require('bcrypt');
const { User } = require('../../lib/mongo');
const File = require('../../lib/file');
const { checkPropertyType } = require('../../lib/utils');
const { ParamTypeError, ModelValidationError, ModelResultError } = require('../../lib/ExtendError');
const errorHandler = require('./errorHandler');

const PasswordPattern = /^[\w]{6,20}$/;

/**
 * 创建账户
 * @param  {Object} userInfo 用户信息, 必填
 * @return {Promise}
 */
exports.create = userInfo => {
  let typeError = checkPropertyType({ userInfo }, {
    userInfo: 'Object|Array'
  });

  if (typeError) {
    return Promise.reject(new ParamTypeError(typeError));
  }

  if (!PasswordPattern.test(userInfo.password)) {
    return Promise.reject(new ModelValidationError('userInfo.password', '用户密码不合法！'));
  }

  userInfo.password = bcrypt.hashSync(userInfo.password, 10);

  return User.create(userInfo).catch(errorHandler);
};

/**
 * 获取一个账户
 * @param  {Object} filter 筛选项, 必填
 * @return {Promise}
 */
exports.getOne = (filter) => {
  let typeError = checkPropertyType({ filter }, {
    filter: 'Object'
  });

  if (typeError) {
    return Promise.reject(new ParamTypeError(typeError));
  }

  return User.findOne(filter)
    .then(user => {
      if (!user) {
        throw new ModelResultError('该用户不存在！');
      } else {
        return user;
      }
    }, errorHandler);
};

/**
 * 更新账户信息
 * @param  {MongooseDocument} user 账户,必填
 * @param  {Object} doc 账户更新的信息
 * @return {Promise}
 */
exports.updateOne = (user, doc) => {
  let typeError = checkPropertyType({ user, doc }, {
    user: {
      expected: 'MongooseDocument',
      test: (val) => val instanceof User
    },
    doc: 'Object'
  });

  if (typeError) {
    return Promise.reject(new ParamTypeError(typeError));
  }

  if (doc.password) {
    if (!PasswordPattern.test(doc.password)) {
      return Promise.reject(new ModelValidationError('userInfo.password', '用户密码不合法！'));
    }

    doc.password = bcrypt.hashSync(doc.password, 10);
  }

  return user
    .updateOne(doc, { runValidators: true })
    .then(result => {
      doc.avatar && File.image.deleteAvatar(user.avatar);

      return result;
    }, errorHandler);
};

/**
 * 删除账户
 * @param  {MongooseDocument} user 账户,必填
 * @return {Promise}
 */
exports.del = (user) => {
  let typeError = checkPropertyType({ user }, {
    user: {
      expected: 'MongooseDocument',
      test: (val) => val instanceof User
    }
  });

  if (typeError) {
    return Promise.reject(new ParamTypeError(typeError));
  }

  return user.remove()
    .then(() => {
      user.avatar && File.image.deleteAvatar(user.avatar);
    }, errorHandler);
};