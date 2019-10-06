const router = require('express').Router();
const PostModel = require('../models/post');
const { errorInterceptor } = require('../middlewares/others');
const { SUCCESS } = require('../config').responseCode;

// 获取文章标签
router.get(
  '',
  errorInterceptor(async (req, res, next) => {
    let filter = {};

    if (req.query.state) {
      filter.state = req.query.state;
    }

    let tags = await PostModel.getTags(filter);

    return res.json({
      code: SUCCESS,
      data: tags
    });
  })
);

module.exports = router;
