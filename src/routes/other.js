const router = require('express').Router();

// 如果之前的路由没有响应则返回404
router.use((req, res, next) => {
  if (!res.headersSent) {
    res.status(404).end();
  }
});

module.exports = router;