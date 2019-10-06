const router = require('express').Router();
const PostModel = require('../models/post');
const {
  checkAdmin,
  checkLogin,
  checkField
} = require('../middlewares/check');
const {
  getByTags,
  getByKey,
  getPublished,
  getPosts
} = require('../middlewares/posts');
const { organizeField } = require('../middlewares/organize');
const { errorInterceptor, deleteRedundantFile } = require('../middlewares/others');
const { SUCCESS, ERROR } = require('../config').responseCode;

// 获取文章集
router.get(
  '/',
  getByTags,
  getByKey,
  getPublished,
  checkLogin,
  getPosts
);

// 查看某篇文章
router.get(
  '/:postID',
  errorInterceptor(async (req, res, next) => {
    // 默认是增加浏览量的，如果链接中带有pv=0,则不增加浏览量
    let increatePv = !(req.query.pv === '0');
    let post = await PostModel.getTreatedByNamedLinkOrID(req.params.postID, increatePv);

    if (post.state === 'editing') {
      if (req.session && req.session.user) {
        await PostModel.isAuthor(post, req.session.user);
      } else {
        return res.json({
          code: ERROR,
          redirect: 'sign'
        });
      }
    }

    return res.json({
      code: SUCCESS,
      data: post
    });
  })
);

// 发表文章
router.post(
  '/',
  checkLogin,
  checkAdmin,
  organizeField({
    key: 'post',
    fields: ['title', 'namedLink', 'describe', 'content', 'tags', 'state'],
    files: ['cover'],
    arrayFields: ['tags']
  }),
  checkField({
    key: 'post',
    fields: {
      title: 'String',
      content: 'String',
      state: 'String'
    },
    errorMessage: '文章信息不完善！'
  }),
  errorInterceptor(async (req, res, next) => {
    // 指定文章作者
    req.locals.post.author = req.session.user._id;

    await PostModel.create(req.locals.post);

    return res.json({
      code: SUCCESS,
      message: '文章发表成功!'
    });
  }),
  // 错误处理
  deleteRedundantFile
);

// 修改文章
router.put(
  '/:postID',
  checkLogin,
  organizeField({
    key: 'post',
    fields: ['title', 'namedLink', 'describe', 'content', 'tags', 'state'],
    files: ['cover'],
    arrayFields: ['tags']
  }),
  errorInterceptor(async (req, res, next) => {
    const postID = req.params.postID;
    const user = req.session.user;
    // 验证和修改
    await PostModel.validateAndUpdateByNamedLinkOrID(postID, user, req.locals.post);

    return res.json({
      code: SUCCESS,
      message: '文章修改成功!'
    });
  }),
  deleteRedundantFile
);

// 删除某篇文章动作
router.delete(
  '/:postID',
  checkLogin,
  errorInterceptor(async (req, res, next) => {
    const postID = req.params.postID;
    const user = req.session.user;
    // 验证和删除
    await PostModel.validateAndDeleteByNamedLinkOrID(postID, user);

    return res.json({
      code: SUCCESS,
      message: '文章删除成功!'
    });
  })
);

module.exports = router;