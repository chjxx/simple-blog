const router = require('express').Router();
const Model = require('../../models');
const { check, organize, intercept } = require('../../middlewares');
const responseCode = require('../../config').responseCode;

// 登陆
router.post(
  '/',
  check.notLogin,
  organize.field({
    key: 'user',
    fields: ['name', 'password']
  }),
  check.field({
    key: 'user',
    fields: {
      name: 'String',
      password: 'String'
    },
    errorMessage: '用户信息不完善！'
  }),
  intercept.error(async (req, res, next) => {
    // 验证和获取账户信息
    let user = await Model.user.validateAndGet(req.locals.user);
    // 如果是管理员账户还要验证下管理员
    req.query.admin && (await Model.user.isAdmin(user));

    req.session.user = user;

    return res.json({
      code: responseCode.SUCCESS,
      data: user,
      message: '登陆成功!'
    });
  })
);

module.exports = router;
