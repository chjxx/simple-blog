const utils = require('../../lib/utils');
const MongoModelFn = require('./mongoModelFn');
const Plugins = require('./plugins');

exports.create = MongoModelFn.create;
exports.treat = Plugins.treat;

/**
 * 获取特定账户的图片资源
 * @param  {Object} user 账户
 * @return {Promise}
 */
exports.getTreatedByUser = user => {
  let fn = utils.composeAsyncFunction(MongoModelFn.get, Plugins.treat);

  return fn({ owner: user._id });
};

/**
 *
 * 根据ID删除图片
 * @param  {string} _id 图片ID, 必填
 * @return {Promise}
 */
exports.delByID = _id => {
  let fn = utils.composeAsyncFunction(MongoModelFn.get, MongoModelFn.del);

  return fn({ _id });
};

/**
 * 删除特定账户所有的图片
 * @param  {Object} user
 * @return {Promise}
 */
exports.delByOwner = user => {
  let fn = utils.composeAsyncFunction(MongoModelFn.get, MongoModelFn.del);

  return fn({ owner: user._id });
};
