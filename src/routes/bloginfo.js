const express = require('express');
const router = express.Router();
const BloginfoModel = require('../models/bloginfo');
const {
  checkLogin,
  checkAdmin
} = require('../middlewares/check');
const { organizeField } = require('../middlewares/organize');
const { errorInterceptor, deleteRedundantFile } = require('../middlewares/others');
const { SUCCESS } = require('../config').responseCode;

// 初始化网站基础数据
init();

// 获取网站基础数据
router.get(
  '',
  errorInterceptor(async (req, res, next) => {
    let bloginfo = await BloginfoModel.getTreated();

    return res.json({
      code: SUCCESS,
      data: bloginfo
    });
  })
);

// 更新网站基础数据
router.put(
  '',
  checkLogin,
  checkAdmin,
  organizeField({
    key: 'bloginfo',
    fields: ['name', 'about', 'blogroll', 'contacts', 'filling'],
    files: ['logo'],
    arrayFields: ['blogroll', 'contacts', 'filling']
  }),
  errorInterceptor(async (req, res, next) => {
    // 修改
    await BloginfoModel.update(req.locals.bloginfo);
    // 获取最新数据
    let bloginfo = await BloginfoModel.getTreated();

    return res.json({
      code: SUCCESS,
      data: bloginfo,
      message: '博客信息修改成功!'
    });
  }),
  // 错误处理
  deleteRedundantFile
);

module.exports = router;

/**
 * 如果数据库里没有 bloginfo 文档则创建
 */
async function init() {
  try {
    await BloginfoModel.getTreated();
  } catch (e) {
    BloginfoModel.create();
  }
}
