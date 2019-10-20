const router = require('express').Router();
const Model = require('../../models');
const { check, organize, intercept, del } = require('../../middlewares');
const responseCode = require('../../config').responseCode;

// 初始化网站基础数据
init();

// 获取网站基础数据
router.get(
  '',
  intercept.error(async (req, res, next) => {
    let bloginfo = await Model.bloginfo.getTreated();

    return res.json({
      code: responseCode.SUCCESS,
      data: bloginfo
    });
  })
);

// 更新网站基础数据
router.put(
  '',
  check.login,
  check.admin,
  organize.field({
    key: 'bloginfo',
    fields: ['name', 'about', 'blogroll', 'contacts', 'filling'],
    files: ['logo'],
    arrayFields: ['blogroll', 'contacts', 'filling']
  }),
  intercept.error(async (req, res, next) => {
    // 修改
    await Model.bloginfo.update(req.locals.bloginfo);
    // 获取最新数据
    let bloginfo = await Model.bloginfo.getTreated();

    return res.json({
      code: responseCode.SUCCESS,
      data: bloginfo,
      message: '博客信息修改成功!'
    });
  }),
  // 错误处理
  del.redundantFile
);

module.exports = router;

/**
 * 如果数据库里没有 bloginfo 文档则创建
 */
async function init() {
  try {
    await Model.bloginfo.getTreated();
  } catch (e) {
    Model.bloginfo.create();
  }
}
