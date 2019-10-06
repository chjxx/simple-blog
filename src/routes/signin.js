const router = require('express').Router();
const UserModel = require('../models/user');
const { checkNotLogin, checkField } = require('../middlewares/check');
const { organizeField } = require('../middlewares/organize');
const { errorInterceptor } = require('../middlewares/others');
const { SUCCESS } = require('../config').responseCode;

// 登陆
router.post(
  '/',
  checkNotLogin,
  organizeField({
    key: 'user',
    fields: ['name', 'password']
  }),
  checkField({
    key: 'user',
    fields: {
      name: 'String',
      password: 'String'
    },
    errorMessage: '用户信息不完善！'
  }),
  errorInterceptor(async (req, res, next) => {
    // 验证和获取账户信息
    let user = await UserModel.validateAndGet(req.locals.user);
    // 如果是管理员账户还要验证下管理员
    req.query.admin && (await UserModel.isAdmin(user));

    req.session.user = user;

    return res.json({
      code: SUCCESS,
      data: user,
      message: '登陆成功!'
    });
  })
);

module.exports = router;
