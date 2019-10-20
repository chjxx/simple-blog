const router = require('express').Router();
const Model = require('../../models');
const { intercept } = require('../../middlewares');
const responseCode = require('../../config').responseCode;

// 获取文章标签
router.get(
  '',
  intercept.error(async (req, res, next) => {
    let filter = {};

    if (req.query.state) {
      filter.state = req.query.state;
    }

    let tags = await Model.post.getTags(filter);

    return res.json({
      code: responseCode.SUCCESS,
      data: tags
    });
  })
);

module.exports = router;
