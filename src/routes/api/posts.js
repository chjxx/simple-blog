const router = require('express').Router();
const Model = require('../../models');
const { check, organize, intercept, del, posts } = require('../../middlewares');
const responseCode = require('../../config').responseCode;

// 获取文章集
router.get(
  '/',
  posts.getByTags,
  posts.getByKey,
  posts.getPublished,
  // 如果要获取的文章是状态不是已发布的则要验证登陆
  check.login,
  posts.get
);

// 查看某篇文章
router.get(
  '/:postID',
  intercept.error(async (req, res, next) => {
    // 默认是增加浏览量的，如果链接中带有pv=0,则不增加浏览量
    let increatePv = !(req.query.pv === '0');
    let post = await Model.post.getTreatedByNamedLinkOrID(req.params.postID, increatePv);

    if (post.state === 'editing') {
      if (req.session && req.session.user) {
        await Model.post.isAuthor(post, req.session.user);
      } else {
        return res.json({
          code: responseCode.ERROR,
          redirect: 'sign'
        });
      }
    }

    return res.json({
      code: responseCode.SUCCESS,
      data: post
    });
  })
);

// 发表文章
router.post(
  '/',
  check.login,
  check.admin,
  organize.field({
    key: 'post',
    fields: ['title', 'namedLink', 'describe', 'content', 'tags', 'state'],
    files: ['cover'],
    arrayFields: ['tags']
  }),
  check.field({
    key: 'post',
    fields: {
      title: 'String',
      content: 'String',
      state: 'String'
    },
    errorMessage: '文章信息不完善！'
  }),
  intercept.error(async (req, res, next) => {
    // 指定文章作者
    req.locals.post.author = req.session.user._id;

    await Model.post.create(req.locals.post);

    return res.json({
      code: responseCode.SUCCESS,
      message: '文章发表成功!'
    });
  }),
  // 错误处理
  del.redundantFile
);

// 修改文章
router.put(
  '/:postID',
  check.login,
  organize.field({
    key: 'post',
    fields: ['title', 'namedLink', 'describe', 'content', 'tags', 'state'],
    files: ['cover'],
    arrayFields: ['tags']
  }),
  intercept.error(async (req, res, next) => {
    const postID = req.params.postID;
    const user = req.session.user;
    // 验证和修改
    await Model.post.validateAndUpdateByNamedLinkOrID(postID, user, req.locals.post);

    return res.json({
      code: responseCode.SUCCESS,
      message: '文章修改成功!'
    });
  }),
  del.redundantFile
);

// 删除某篇文章动作
router.delete(
  '/:postID',
  check.login,
  intercept.error(async (req, res, next) => {
    const postID = req.params.postID;
    const user = req.session.user;
    // 验证和删除
    await Model.post.validateAndDeleteByNamedLinkOrID(postID, user);

    return res.json({
      code: responseCode.SUCCESS,
      message: '文章删除成功!'
    });
  })
);

module.exports = router;