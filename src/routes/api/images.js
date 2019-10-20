const router = require('express').Router();
const Model = require('../../models');
const { check, organize, intercept, del } = require('../../middlewares');
const responseCode = require('../../config').responseCode;
const f = require('../../lib/file');

// 获取图片库图片信息
router.get(
  '/',
  check.login,
  intercept.error(async (req, res, next) => {
    let images = await Model.image.getTreatedByUser(req.session.user);

    return res.json({
      code: responseCode.SUCCESS,
      data: images
    });
  })
);

// 上传图片
router.post(
  '/',
  check.login,
  organize.imageCreateFields,
  intercept.error(async (req, res, next) => {
    await Model.image.create(req.locals.info);
    // 生成返回的数据
    let data = req.locals.info.map(img => {
      return {
        filename: img.uploadname,
        src: f.path.resolve.image.access.resource(img.filename)
      };
    });

    return res.json({
      code: responseCode.SUCCESS,
      data: data
    });
  }),
  // 错误处理
  del.redundantFile
);

module.exports = router;