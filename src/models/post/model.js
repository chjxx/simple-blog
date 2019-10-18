const { Post } = require('../../lib/mongo');
const f = require('../../lib/file');
const { notType, getType, checkPropertyType } = require('../../lib/utils');
const {
  ParamTypeError,
  ModelResultError
} = require('../../lib/ExtendError');
const errorHandler = require('./errorHandler');

/**
 * 创建文章
 * @param  {Object} doc 文章信息, 必填
 * @return {Promise}
 */
exports.create = doc => {
  let paramError = checkPropertyType(
    { doc },
    {
      doc: 'Object|Array'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  if (doc.content) {
    doc.content = simplifyImageUrl(doc.content);
  }

  return Post.create(doc).catch(errorHandler);
};

/**
 * 获取特定一组文章
 * @param  {Object} filter 筛选项, 必填
 * @param  {Object} options 对数据进一步筛选
 * @return {Promise}
 */
exports.get = (filter, options) => {
  let paramError = checkPropertyType(
    { filter },
    {
      filter: 'Object'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  let { offset, limit } = Object.assign({}, options);

  offset = offset || 0;
  limit = limit || 0;

  return Post.find(filter)
    .skip(offset)
    .limit(limit)
    .populate({
      path: 'author',
      select: 'name avatar'
    })
    .sort({
      created_at: -1
    })
    .catch(errorHandler);
};

/**
 * 根据filter获取一篇文章
 * @param  {Object} filter 筛选项, 必填
 * @return {Promise}
 */
exports.getOne = filter => {
  let paramError = checkPropertyType(
    { filter },
    {
      filter: 'Object'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  return Post.findOne(filter)
    .populate({
      path: 'author',
      select: 'name avatar'
    })
    .then(post => {
      if (!post) {
        throw new ModelResultError('文章不存在或者已被删除!');
      }

      return post;
    }, errorHandler);
};

/**
 * 获取一组拥有特定标签的文章
 * @param  {Object} filter 筛选项, 拥有state和tags属性, 必填
 * @param  {Object} options 对数据进一步筛选
 * @return {Promise}
 */
exports.getByTags = (filter, options) => {
  let paramError = checkPropertyType(
    { filter },
    {
      filter: 'Object',
      'filter.tags': 'Array',
      'filter.state': 'Undefined|String'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  let { state, tags } = filter;

  let param = {
    tags: {
      $all: tags
    }
  };

  if (state) {
    param.state = state;
  }

  return exports.get(param, options);
};

/**
 * 获取一组在标题、内容或者标签中带有特定关键字的已发布的文章
 * @param  {Object} filter 筛选项, 拥有state和key属性, 必填
 * @param  {Object} options 对数据进一步筛选
 * @return {Promise}
 */
exports.getByKey = (filter, options) => {
  let paramError = checkPropertyType(
    { filter },
    {
      filter: 'Object',
      'filter.key': 'String',
      'filter.state': 'Undefined|String'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  let { state, key } = filter;

  let param = {
    $or: [
      {
        title: {
          $regex: key,
          $options: 'i'
        }
      },
      {
        content: {
          $regex: key,
          $options: 'i'
        }
      },
      {
        tags: {
          $all: [key]
        }
      }
    ]
  };

  if (state) {
    param.state = state;
  }

  return exports.get(param, options);
};

/**
 * 获取特定状态的文章的标签集
 * @param  {Object} filter 筛选项, 可选
 * @return {Promise}
 */
exports.getTags = filter => {
  let stages = [];

  filter = filter || {};

  let paramError = checkPropertyType(filter, {
    state: 'Undefined|String'
  });

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  if (filter.state) {
    stages.push({
      $match: {
        state: filter.state
      }
    });
  }

  stages.push({
    $group: {
      _id: null,
      tagArr: { $push: '$tags' }
    }
  });

  return Post.aggregate(stages).then(result => {
    let tags = {};

    if (result.length) {
      result[0].tagArr.reduce((tags, postTags) => {
        postTags.forEach(tag => {
          if (tags[tag]) {
            tags[tag] += 1;
          } else {
            tags[tag] = 1;
          }
        });

        return tags;
      }, tags);
    }

    return tags;
  }, errorHandler);
};

/**
 * 更新文章
 * @param  {MongooseDocument} post 文章MongooseDocument, 必填项
 * @param  {Object} doc 更新的文章数据, 必填
 * @return {Promise}
 */
exports.updateOne = (post, doc) => {
  let paramError = checkPropertyType(
    { post, doc },
    {
      post: {
        expected: 'MongooseDocument',
        test: val => val instanceof Post
      },
      doc: 'Object'
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  if (doc.content) {
    doc.content = simplifyImageUrl(doc.content);
  }

  return post.updateOne(doc, { runValidators: true }).then(
    result => {
      if (doc.cover && post.cover) {
        f.image.deleteCover(post.cover);
      }

      return result;
    }, errorHandler);
};

/**
 * 增加文章浏览量
 * @param  {MongooseDocument} post 文章MongooseDocument, 必填
 * @return {Promise}
 */
exports.increasePv = post => {
  let paramError = checkPropertyType(
    { post },
    {
      post: {
        expected: 'MongooseDocument',
        test: val => val instanceof Post
      }
    }
  );

  if (paramError) {
    return Promise.reject(new ParamTypeError(paramError));
  }

  return post.updateOne({ $inc: { pv: 1 } })
    .then(() => exports.getOne({ _id: post._id }), errorHandler);
};

/**
 * 计算特定一组文章数量
 * @param  {Object} filter 筛选项, 可选
 * @return {Promise}
 */
exports.countDocument = filter => {
  filter = Object.assign({}, filter);

  return Post.where(filter)
    .countDocuments()
    .catch(errorHandler);
};

/**
 * 删除文章
 * @param  {MongooseDocumentArray|MongooseDocument} posts 文章MongooseDocument, 必填
 * @return {Promise}
 */
exports.del = posts => {
  if (notType(posts, 'Array')) {
    posts = [posts];
  }

  let paramError = checkPropertyType(
    { posts },
    {
      posts: {
        expected: 'MongooseDocumentArray',
        test: val => val.every(post => post instanceof Post)
      }
    }
  );

  if (paramError) {
    paramError.actualType = posts.map(post => getType(post)).join(',');

    return Promise.reject(new ParamTypeError(paramError));
  }

  let postPromises = posts.map(post => {
    return post.remove().then(() => {
      return post.cover && f.image.deleteCover(post.cover);
    });
  });

  return Promise.all(postPromises).catch(errorHandler);
};

function simplifyImageUrl(content) {
  const imageRE = /!\[([\s\S]*?)\]\(([\S]*?)([\s\S]*?)\)/g;

  return content.replace(imageRE, matched => {
    return f.image.simplifyResourcePath(matched);
  });
}