const { composeAsyncFunction, bindTrailingArgs } = require('../../lib/utils');
const BloginfoModel = require('../bloginfo');
const ImageModel = require('../image');
const Model = require('./model');
const Plugins = require('./plugins');

exports.create = Model.create;

/**
 * 根据ID获取账号
 * @param  {string} _id 用户ID，必填
 * @return {Promise}
 */
exports.getByID = _id => Model.getOne({ _id });

/**
 * 根据用户名获取账号
 * @param  {string} name 用户名，必填
 * @param  {Object} options 进一步筛选数据
 * @return {Promise}
 */
exports.getByName = (name, options) => Model.getOne({ name }, options);

/**
 * 检查账户是否为管理员账户
 * @param  {Object} user 账户，必填
 * @return {Promise}
 */
exports.isAdmin = BloginfoModel.isAdmin;

/**
 * 添加该账号到管理员名单
 * @param  {Object} user 账户，必填
 * @return {Promise}
 */
exports.addToAdmin = BloginfoModel.addAdmin;

/**
 * 更新账户信息
 * @param  {Object} user 账户，必填
 * @param  {Object} doc 账户更新的信息，必填
 * @return {Promise}
 */
exports.update = (user, doc) => {
  let updateFn = bindTrailingArgs(Model.updateOne, doc);
  let fn = composeAsyncFunction(exports.getByID, updateFn);

  return fn(user._id);
};

/**
 * 删除账户
 * @param  {Object} user 账户，必填
 * @return {Promise}
 */
exports.del = user => {
  let fn = composeAsyncFunction(exports.getByID, Model.del);

  return fn(user._id).then(async () => {
    await ImageModel.delByOwner(user);
    await BloginfoModel.reduceAdmin(user);
  });
};

/**
 * 跟据ID获取账户信息，该对象为普通对象，不带有数据库操作函数，必填
 * @param  {string} _id 用户ID，必填
 * @return {Promise}
 */
exports.getTreatedByID = _id => {
  let fn = composeAsyncFunction(exports.getByID, Plugins.treat);
  return fn(_id);
};

/**
 * 验证账户及密码，返回账户详细信息
 * @param  {Object} userInfo 账户信息，包含name和password属性，必填
 * @return {Promise}
 */
exports.validateAndGet = userInfo => {
  let { name, password } = userInfo;
  let checkPasswordFn = bindTrailingArgs(Plugins.checkPassword, password);
  let fn = composeAsyncFunction(exports.getByName, checkPasswordFn, Plugins.treat);

  return fn(name);
};

/**
 * 修改账户信息
 * @param  {Object} user 账户，必填
 * @param  {string} password 原密码，必填
 * @param  {string} newpassword 新密码，必填
 * @return {Promise}
 */
exports.validateAndUpdatePassword = (user, password, newpassword) => {
  let checkPasswordFn = bindTrailingArgs(Plugins.checkPassword, password);
  let updateFn = bindTrailingArgs(Model.updateOne, { password: newpassword });
  let fn = composeAsyncFunction(exports.getByID, checkPasswordFn, updateFn);

  return fn(user._id);
};
