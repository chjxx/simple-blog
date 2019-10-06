const router = require('express').Router();
const UserModel = require('../models/user');
const { checkNotLogin, checkField } = require('../middlewares/check');
const { organizeField } = require('../middlewares/organize');
const { errorInterceptor, deleteRedundantFile } = require('../middlewares/others');
const { SUCCESS } = require('../config').responseCode;

// 注册账户
router.post(
  '/',
  checkNotLogin,
  organizeField({
    key: 'user',
    fields: ['name', 'email', 'password'],
    files: ['avatar']
  }),
  checkField({
    key: 'user',
    fields: {
      name: 'String',
      email: 'String',
      password: 'String',
      avatar: 'String'
    },
    errorMessage: '账户信息不完善!'
  }),
  errorInterceptor(async (req, res, next) => {
    // 创建
    let user = await UserModel.create(req.locals.user);
    // 如果是管理员账户注册则添加到管理员列表
    if (req.query.admin) {
      await UserModel.addToAdmin(user).catch(async err => {
        // 如果无法添加则删除账户
        await UserModel.del(user);
        throw err;
      });
    }

    return res.json({
      code: SUCCESS,
      data: '账号注册成功！'
    });
  }),
  // 错误处理
  deleteRedundantFile
);

module.exports = router;
