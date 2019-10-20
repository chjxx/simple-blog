const express = require('express');
const fileConfig = require('../config/file');

// 配置资源
module.exports = app => {
  app.use('/assets', express.static(fileConfig.uploadRootPath));
};