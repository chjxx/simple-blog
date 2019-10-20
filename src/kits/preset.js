const f = require('../lib/file');

// 预设请求生命周期基础数据
module.exports = app => {
  // 初始化request生命周期自定义变量
  app.use((req, res, next) => {
    req.locals = {};
    // 根据访问路径确定上传的文件存放的文件夹
    for (let item of f.accessPathMap) {
      if (item[0].test(req.path)) {
        req.locals.uploadDir = item[1];

        break;
      }
    }

    return next();
  });
};