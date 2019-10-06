const router = require('express').Router();
const { checkLogin } = require('../middlewares/check');
const { errorInterceptor } = require('../middlewares/others');
const { responseCode, session } = require('../config');

// 登出
router.get('/', checkLogin, errorInterceptor(async(req, res, next) => {
  await req.session.destroy();

  res.clearCookie(session.key, '/');

  return res.json({
    code: responseCode.SUCCESS,
    message: '登出成功!'
  });
}));

module.exports = router;