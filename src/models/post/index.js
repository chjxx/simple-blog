let { composeAsyncFunction, bindTrailingArgs } = require('../../lib/utils');
let Model = require('./model');
let Plugins = require('./plugins');

exports.create = Model.create;
exports.getTags = Model.getTags;
exports.isAuthor = Plugins.isAuthor;

/**
 * 计算特定一组文章数量
 * @param  {Object} filter 筛选项, 可选
 * @return {Promise}
 */
exports.countDocument = Model.countDocument;

/**
 * 根据命名链接或ID删除文章
 * @param  {ObjectId|string} _id 文章ID，必填
 * @return {Promise}
 */
exports.delByNameLinkOrID = _id => {
  let fn = composeAsyncFunction(Model.getOne, Model.del);

  return fn({ namedLink: _id })
    .catch(() => fn({ _id }));
};

/**
 * 根据命名链接或ID获取文章
 * @param  {ObjectId|string} _id 文章ID，必填
 * @param  {string} key 关键字，必填
 * @return {Promise}
 */
exports.getTreatedByNamedLinkOrID = (_id, increasePv) => {
  let fn;

  if (increasePv) {
    fn = composeAsyncFunction(Model.getOne, Model.increasePv, Plugins.treat);
  } else {
    fn = composeAsyncFunction(Model.getOne, Plugins.treat);
  }

  return fn({ namedLink: _id })
    .catch(() => fn({ _id }));
};

/**
 * 根据给定的tag数组查找包含该tag数组的文章集
 * @param  {Object} filter 筛选器，包含state和tags属性，必填
 * @return {Promise}
 */
exports.getTreatedByTags = filter => {
  let fn = composeAsyncFunction(Model.getByTags, Plugins.treat);

  return fn(filter);
};

/**
 * 根据给定的tag数组查找标题或者内容或者标签中包含该关键字的文章集
 * @param  {Object} filter 筛选器，包含state和key属性
 * @return {Promise}
 */
exports.getTreatedByKey = filter => {
  let fn = composeAsyncFunction(Model.getByKey, Plugins.treat);

  return fn(filter);
};

/**
 * 根据给定的文章属性筛选匹配的文章
 * @param  {Object} filter 筛选器，必填
 * @param  {Object} options 对数据进一步筛选
 * @return {Promise}
 */
exports.getTreated = (filter, options = {}) => {
  let fn = composeAsyncFunction(Model.get, Plugins.treat);

  return fn(filter, options);
};

/**
 * 根据给定的文章属性筛选匹配的精简文章数据
 * @param  {Object} filter 筛选器，必填
 * @param  {Object} options 对数据进一步筛选, 可选
 * @return {Promise}
 */
exports.getLiteTreated = (filter, options = {}) => {
  let reservedKeys = ['_id', 'namedLink', 'title', 'created_at', 'updated_at', 'author'];
  let treatFn = bindTrailingArgs(Plugins.treat, reservedKeys);
  let fn = composeAsyncFunction(Model.get, treatFn);

  return fn(filter, options);
};

/**
 * 根据命名链接或者ID验证及更新文章
 * @param  {string} _id 文章ID，必填
 * @param  {Object} user 用户信息, 带_id属性，必填
 * @param  {Object} doc 文章更新的信息，必填
 * @return {Promise}
 */
exports.validateAndUpdateByNamedLinkOrID = (_id, user, doc) => {
  let isAuthorFn = bindTrailingArgs(Plugins.isAuthor, user);
  let updateFn = bindTrailingArgs(Model.updateOne, doc);
  let fn = composeAsyncFunction(Model.getOne, isAuthorFn, updateFn);

  return fn({ namedLink: _id })
    .catch(() => fn({ _id }));
};

/**
 * 根据命名链接或者ID验证及删除文章
 * @param  {string} _id 文章ID，必填
 * @param  {Object} user 用户信息, 带_id属性，必填
 * @return {Promise}
 */
exports.validateAndDeleteByNamedLinkOrID = (_id, user) => {
  let isAuthorFn = bindTrailingArgs(Plugins.isAuthor, user);
  let fn = composeAsyncFunction(Model.getOne, isAuthorFn, Model.del);

  return fn({ namedLink: _id })
    .catch(() => fn({ _id }));
};