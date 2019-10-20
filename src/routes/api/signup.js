const router = require('express').Router();
const Model = require('../../models');
const { check, organize, intercept, del } = require('../../middlewares');
const responseCode = require('../../config').responseCode;

// 注册账户
router.post(
  '/',
  check.notLogin,
  organize.field({
    key: 'user',
    fields: ['name', 'email', 'password'],
    files: ['avatar']
  }),
  check.field({
    key: 'user',
    fields: {
      name: 'String',
      email: 'String',
      password: 'String',
      avatar: 'String'
    },
    errorMessage: '账户信息不完善!'
  }),
  intercept.error(async (req, res, next) => {
    // 创建
    let user = await Model.user.create(req.locals.user);
    // 如果是管理员账户注册则添加到管理员列表
    if (req.query.admin) {
      await Model.user.addToAdmin(user).catch(async err => {
        // 如果无法添加则删除账户
        await Model.user.del(user);
        throw err;
      });
    }

    return res.json({
      code: responseCode.SUCCESS,
      data: '账号注册成功！'
    });
  }),
  // 错误处理
  del.redundantFile
);

module.exports = router;
