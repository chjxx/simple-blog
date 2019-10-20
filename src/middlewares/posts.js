const Model = require('../models');
const intercept = require('./intercept');
const utils = require('../lib/utils');
const responseCode = require('../config').responseCode;
const { MiddlewareError } = require('../lib/ExtendError');

// 根据标签集搜索文章
exports.getByTags = (req, res, next) => {
  let { tags } = req.query;

  if (tags) {
    if (utils.notType(tags, 'Array')) {
      tags = [tags];
    }

    return intercept.error(async (req, res, next) => {
      let posts = await Model.post.getTreatedByTags({ state: 'published', tags });
      return res.json({
        code: responseCode.SUCCESS,
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
    if (utils.notType(key, 'String')) {
      return next(new MiddlewareError('参数不合法！'));
    }

    return intercept.error(async (req, res, next) => {
      let posts = await Model.post.getTreatedByKey({ state: 'published', key });

      return res.json({
        code: responseCode.SUCCESS,
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
  return req.query.state === 'published' ? exports.get(req, res, next) : next();
};

// 获取文章
exports.get = intercept.error(async (req, res, next) => {
  let { state, offset, limit, quality } = req.query;
  let filter = {};

  offset = parseInt(offset);
  limit = parseInt(limit);
  Number.isNaN(offset) && (offset = 0);
  Number.isNaN(limit) && (limit = 0);
  // 指定文章状态
  if (utils.isType(state, 'String')) filter.state = state;
  // 指定文章作者
  if (req.session && req.session.user && state !== 'published') {
    filter.author = req.session.user._id;
  }

  // 轻量版
  if (quality === 'lite') {
    let posts = await Model.post.getLiteTreated(filter, { offset, limit });

    return res.json({
      code: responseCode.SUCCESS,
      data: posts
    });
  } else {
    // 详细版
    // 文章的promise
    let postsPromise = Model.post.getTreated(filter, { offset, limit });
    // 文章数量的promise
    let countPromise = Model.post.countDocument(filter);
    let [posts, postsCount] = await Promise.all([postsPromise, countPromise]);

    return res.json({
      code: responseCode.SUCCESS,
      data: {
        count: postsCount,
        chunk: posts
      }
    });
  }
});
