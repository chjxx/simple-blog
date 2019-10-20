const utils = require('../../lib/utils');
const BloginfoModel = require('../bloginfo');
const ImageModel = require('../image');
const MongoModelFn = require('./mongoModelFn');
const Plugins = require('./plugins');

exports.create = MongoModelFn.create;

/**
 * 根据ID获取账号
 * @param  {string} _id 用户ID，必填
 * @return {Promise}
 */
exports.getByID = _id => MongoModelFn.getOne({ _id });

/**
 * 根据用户名获取账号
 * @param  {string} name 用户名，必填
 * @param  {Object} options 进一步筛选数据
 * @return {Promise}
 */
exports.getByName = (name, options) => MongoModelFn.getOne({ name }, options);

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
  let updateFn = utils.bindTrailingArgs(MongoModelFn.updateOne, doc);
  let fn = utils.composeAsyncFunction(exports.getByID, updateFn);

  return fn(user._id);
};

/**
 * 删除账户
 * @param  {Object} user 账户，必填
 * @return {Promise}
 */
exports.del = user => {
  let fn = utils.composeAsyncFunction(exports.getByID, MongoModelFn.del);

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
  let fn = utils.composeAsyncFunction(exports.getByID, Plugins.treat);
  return fn(_id);
};

/**
 * 验证账户及密码，返回账户详细信息
 * @param  {Object} userInfo 账户信息，包含name和password属性，必填
 * @return {Promise}
 */
exports.validateAndGet = userInfo => {
  let { name, password } = userInfo;
  let checkPasswordFn = utils.bindTrailingArgs(Plugins.checkPassword, password);
  let fn = utils.composeAsyncFunction(exports.getByName, checkPasswordFn, Plugins.treat);

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
  let checkPasswordFn = utils.bindTrailingArgs(Plugins.checkPassword, password);
  let updateFn = utils.bindTrailingArgs(MongoModelFn.updateOne, { password: newpassword });
  let fn = utils.composeAsyncFunction(exports.getByID, checkPasswordFn, updateFn);

  return fn(user._id);
};
