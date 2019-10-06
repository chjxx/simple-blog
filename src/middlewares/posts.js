const PostModel = require('../models/post');
const { errorInterceptor } = require('./others');
const { isType, notType } = require('../lib/utils');
const { SUCCESS } = require('../config').responseCode;
const { MiddlewareError } = require('../lib/ExtendError');

// 根据标签集搜索文章
exports.getByTags = (req, res, next) => {
  let { tags } = req.query;

  if (tags) {
    if (notType(tags, 'Array')) {
      tags = [tags];
    }

    return errorInterceptor(async (req, res, next) => {
      let posts = await PostModel.getTreatedByTags({ state: 'published', tags });
      return res.json({
        code: SUCCESS,
        data: {
          chunk: posts,
          count: posts.length
        }
      });
    })(req, res, next);
  } else {
    next();
  }
};

// 根据关键字搜索文章
exports.getByKey = (req, res, next) => {
  let { key } = req.query;

  if (key) {
    if (notType(key, 'String')) {
      return next(new MiddlewareError('参数不合法！'));
    }

    return errorInterceptor(async (req, res, next) => {
      let posts = await PostModel.getTreatedByKey({ state: 'published', key });

      return res.json({
        code: SUCCESS,
        data: {
          chunk: posts,
          count: posts.length
        }
      });
    })(req, res, next);
  } else {
    next();
  }
};

// 获取已发布的文章
exports.getPublished = (req, res, next) => {
  return req.query.state === 'published' ? exports.getPosts(req, res, next) : next();
};

// 获取文章
exports.getPosts = errorInterceptor(async (req, res, next) => {
  let { state, offset, limit, quality } = req.query;
  let filter = {};

  offset = parseInt(offset);
  limit = parseInt(limit);
  Number.isNaN(offset) && (offset = 0);
  Number.isNaN(limit) && (limit = 0);
  // 指定文章状态
  if (isType(state, 'String')) filter.state = state;
  // 指定文章作者
  if (req.session && req.session.user && state !== 'published') {
    filter.author = req.session.user._id;
  }

  // 轻量版
  if (quality === 'lite') {
    let posts = await PostModel.getLiteTreated(filter, { offset, limit });

    return res.json({
      code: SUCCESS,
      data: posts
    });
  } else {
    // 详细版
    // 文章的promise
    let postsPromise = PostModel.getTreated(filter, { offset, limit });
    // 文章数量的promise
    let countPromise = PostModel.countDocument(filter);
    let [posts, postsCount] = await Promise.all([postsPromise, countPromise]);

    return res.json({
      code: SUCCESS,
      data: {
        count: postsCount,
        chunk: posts
      }
    });
  }
});
