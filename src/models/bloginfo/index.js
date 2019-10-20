const utils = require('../../lib/utils');
const MongoModelFn = require('./mongoModelFn');
const Plugins = require('./plugins');

exports.create = MongoModelFn.create;

/**
 * 获取处理后博客信息
 * @return {Promise}
 */
exports.getTreated = () => {
  let fn = utils.composeAsyncFunction(MongoModelFn.get, Plugins.treat);

  return fn();
};

/**
 * 判断某账户是否为管理员账户
 * @param  {Object} user 用户信息, 必填
 * @return {Promise}
 */
exports.isAdmin = user => {
  // 将user绑定到该函数参数的尾部
  let checkAdminFn = utils.bindTrailingArgs(Plugins.checkAdmin, user);
  let fn = utils.composeAsyncFunction(MongoModelFn.get, checkAdminFn);

  return fn();
};

/**
 * 添加管理员
 * @param  {Object} user 用户信息, 必填
 * @return {Promise}
 */
exports.addAdmin = user => {
  // 将user绑定到该函数参数的尾部
  let checkNotAdminFn = utils.bindTrailingArgs(Plugins.checkNotAdmin, user);
  let pushAdminFn = utils.bindTrailingArgs(MongoModelFn.pushAdmin, user);
  let fn = utils.composeAsyncFunction(MongoModelFn.get, Plugins.checkAdminLimit, checkNotAdminFn, pushAdminFn);

  return fn();
};

/**
 * 移除管理员
 * @param  {Object} user 用户信息, 必填
 * @return {Promise}
 */
exports.reduceAdmin = user => {
  // 将user绑定到该函数参数的尾部
  let pullAdminFn = utils.bindTrailingArgs(MongoModelFn.pullAdmin, user);
  let fn = utils.composeAsyncFunction(MongoModelFn.get, pullAdminFn);

  return fn();
};

/**
 * 更新博客信息
 * @param  {Object} doc 要更新的博客信息, 必填
 * @return {Promise}
 */
exports.update = doc => {
  // 此接口不更新管理员账户
  doc.admin && delete doc.admin;
  // 将doc绑定到该函数参数的尾部
  let updateFn = utils.bindTrailingArgs(MongoModelFn.updateOne, doc);
  let fn = utils.composeAsyncFunction(MongoModelFn.get, updateFn);

  return fn();
};