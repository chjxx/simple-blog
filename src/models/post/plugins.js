const { ObjectId } = require('mongoose').Types;
const { Post } = require('../../lib/mongo');
const File = require('../../lib/file');
const { isType, getType, checkPropertyType } = require('../../lib/utils');
const { ParamTypeError, ModelResultError } = require('../../lib/ExtendError');

/**
 * 判断是否为文章作者
 * @param  {MongooseDocument|Object} post 文章，必填
 * @param  {MongooseDocument|Object} user 账号，必填
 * @return {Object|Error}
 */
exports.isAuthor = (post, user) => {
  let paramError = checkPropertyType({ post, user }, {
    post: 'Object',
    'post.author': 'Object',
    'post.author._id': {
      expected: 'ObjectId|string',
      test: (val) => val instanceof ObjectId || isType(val, 'String')
    },
    user: 'Object',
    'user._id': {
      expected: 'ObjectId|string',
      test: (val) => val instanceof ObjectId || isType(val, 'String')
    }
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  if (post.author._id.toString() === user._id.toString()) {
    return post;
  } else {
    throw new ModelResultError('非文章作者！');
  }
};

/**
 * 加工文章，删除敏感数据等
 * @param  {Array|Object} result 文章或文章集，必填
 * @param  {Array} reservedKeys 保留的属性，可选
 * @return {Array|Object}
 */
exports.treat = (result, reservedKeys) => {
  let posts = [];

  if (isType(result, 'Array')) {
    // 如果是MongooseDocument,则转为普通对象
    result = result.map(post => (post instanceof Post) ? post.toObject() : post);

    posts = result;
  } else {
    // 如果是MongooseDocument,则转为普通对象
    result = (result instanceof Post) ? result.toObject() : result;

    posts.push(result);
  }

  let paramError = checkPropertyType({ posts, reservedKeys }, {
    posts: {
      expected: 'ObjectArray',
      test: (val) => val.every(post => isType(post, 'Object'))
    },
    reservedKeys: 'Undefined|Array'
  });

  if (paramError) {
    paramError.actualType = posts.map(post => getType(post)).join(',');

    throw new ParamTypeError(paramError);
  }
  // 保留的属性名
  reservedKeys = reservedKeys || ['_id', 'author', 'title', 'namedLink', 'cover', 'describe', 'content', 'tags', 'state', 'pv', 'created_at', 'updated_at'];
  // 删除多余的属性，处理需要处理的属性
  posts.forEach((post, index) => {
    Object.keys(post).forEach(key => {
      if (!reservedKeys.includes(key)) {
        delete post[key];
      } else if (key === 'cover' && post[key]) {
        post[key] = File.image.fillCoverPath(post[key]);
      } else if (key === 'author' && post[key].avatar) {
        post[key].avatar = File.image.fillAvatarPath(post[key].avatar);
      }
    });
  });

  return result;
};