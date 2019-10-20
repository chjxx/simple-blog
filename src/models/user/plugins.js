const bcrypt = require('bcrypt');
const f = require('../../lib/file');
const MongoModel = require('../../lib/mongo');
const utils = require('../../lib/utils');
const { ParamTypeError, ModelValidationError } = require('../../lib/ExtendError');

/**
 * 检查用户密码是否正确
 * @param  {MongooseDocument|Object} user 账户，必填项
 * @param  {string} password 密码，必填项
 * @return {Promise}
 */
exports.checkPassword = (user, password) => {
  let paramError = utils.checkPropertyType({ user, password }, {
    user: 'Object',
    password: 'String'
  });

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  let result = bcrypt.compareSync(password, user.password);

  if (!result) {
    throw new ModelValidationError('password', '用户密码错误！');
  } else {
    return user;
  }
};

/**
 * 处理用户数据
 * @param  {Array|Object|MongooseDocument} user 账户，必填项
 * @param  {Array} reservedKeys 保留的属性，可选
 * @return {Array|Object}
 */
exports.treat = (result, reservedKeys) => {
  // 文档容器
  let users = [];

  // 统一文档格式，供后面数据处理
  if (utils.isType(result, 'Array')) {
    // 如果是MongooseDocument,则转为普通对象
    result = result.map(user => (user instanceof MongoModel.User) ? user.toObject() : user);

    users = result;
  } else {
    // 如果是MongooseDocument,则转为普通对象
    result = (result instanceof MongoModel.User) ? result.toObject() : result;

    users.push(result);
  }
  // 检查参数类型
  let paramError = utils.checkPropertyType({ users, reservedKeys }, {
    users: {
      expected: 'ObjectArray',
      test: (val) => val.every(user => utils.isType(user, 'Object'))
    },
    reservedKeys: 'Undefined|Array'
  });
  // 如果类型有错则报错
  if (paramError) {
    paramError.actualType = users.map(user => utils.getType(user)).join(',');

    throw new ParamTypeError(paramError);
  }
  // 保留的属性名
  reservedKeys = reservedKeys || ['_id', 'name', 'email', 'avatar', 'bio', 'gender'];
  // 删除多余的属性，处理需要处理的属性
  users.forEach(user => {
    Object.keys(user).forEach(key => {
      if (!reservedKeys.includes(key)) {
        delete user[key];
      } else if (key === 'avatar' && user[key]) {
        user[key] = f.path.resolve.image.access.avatar(user[key]);
      }
    });
  });

  return result;
};