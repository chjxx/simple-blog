const router = require('express').Router();
const UserModel = require('../models/user');
const { checkLogin, checkField } = require('../middlewares/check');
const { organizeField } = require('../middlewares/organize');
const { errorInterceptor, deleteRedundantFile } = require('../middlewares/others');
const { SUCCESS } = require('../config').responseCode;

// 获取当前登陆的账户信息
router.get(
  '/',
  checkLogin,
  errorInterceptor(async (req, res, next) => {
    // 如果管理员账户，则要先查询数据库是否为管理员账户
    if (req.query.admin) {
      await UserModel.isAdmin(req.session.user);
    }

    return res.set({
      'Cache-Control': 'no-cache'
    }).json({
      code: SUCCESS,
      data: req.session.user
    });
  }),
  (err, req, res, next) => {
    if (req.session && req.session.user) {
      delete req.session.user;
    }

    return next(err);
  }
);

// 修改账户信息
router.put(
  '/',
  checkLogin,
  organizeField({
    key: 'user',
    fields: ['gender', 'bio', 'about'],
    files: ['avatar']
  }),
  errorInterceptor(async (req, res, next) => {
    // 修改
    await UserModel.update(req.session.user, req.locals.user);
    // 获取最新数据
    let user = await UserModel.getTreatedByID(req.session.user._id);
    // 保存到session
    req.session.user = user;

    return res.json({
      code: SUCCESS,
      data: user,
      message: '个人信息修改成功！'
    });
  }),
  // 错误处理
  deleteRedundantFile
);

// 修改账户密码
router.put(
  '/password',
  checkLogin,
  organizeField({
    key: 'user',
    fields: ['password', 'newpassword']
  }),
  checkField({
    key: 'user',
    fields: {
      password: 'String',
      newpassword: 'String'
    },
    errorMessage: '用户信息不完善！'
  }),
  errorInterceptor(async (req, res, next) => {
    let { password, newpassword } = req.locals.user;
    // 验证和修改
    await UserModel.validateAndUpdatePassword(
      req.session.user,
      password,
      newpassword
    );
    // 获取最新数据
    let user = await UserModel.getTreatedByID(req.session.user._id);
    // 保存到session
    req.session.user = user;

    return res.json({
      code: SUCCESS,
      message: '个人密码修改成功!',
      data: user
    });
  })
);
// 删除账户
router.delete(
  '/',
  checkLogin,
  errorInterceptor(async (req, res, next) => {
    // 获取最新数据
    let user = await UserModel.getTreatedByID(req.session.user._id);

    await UserModel.del(user);

    delete req.session.user;

    return res.json({
      code: SUCCESS,
      message: '账户删除成功!',
      data: user
    });
  })
);

module.exports = router;
