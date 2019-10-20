const compression = require('compression');

// 配置传输文件压缩
module.exports = app => {
  app.use(compression());
};