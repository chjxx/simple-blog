const router = require('express').Router();
const ImageModel = require('../models/image');
const { checkLogin } = require('../middlewares/check');
const { organizeImageCreateFields } = require('../middlewares/organize');
const { errorInterceptor, deleteRedundantFile } = require('../middlewares/others');
const { SUCCESS } = require('../config').responseCode;
const f = require('../lib/file');

// 获取图片库图片信息
router.get(
  '/',
  checkLogin,
  errorInterceptor(async (req, res, next) => {
    let images = await ImageModel.getTreatedByUser(req.session.user);

    return res.json({
      code: SUCCESS,
      data: images
    });
  })
);

// 上传图片
router.post(
  '/',
  checkLogin,
  organizeImageCreateFields,
  errorInterceptor(async (req, res, next) => {
    await ImageModel.create(req.locals.info);
    // 生成返回的数据
    let data = req.locals.info.map(img => {
      return {
        filename: img.uploadname,
        src: f.image.resolveResourcePath(img.filename)
      };
    });

    return res.json({
      code: SUCCESS,
      data: data
    });
  }),
  // 错误处理
  deleteRedundantFile
);

module.exports = router;