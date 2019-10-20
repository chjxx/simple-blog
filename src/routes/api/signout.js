const router = require('express').Router();
const { check, intercept } = require('../../middlewares');
const { responseCode, session } = require('../../config');

// 登出
router.get('/',
  check.login,
  intercept.error(async(req, res, next) => {
    await req.session.destroy();

    res.clearCookie(session.key, '/');

    return res.json({
      code: responseCode.SUCCESS,
      message: '登出成功!'
    });
  })
);

module.exports = router;