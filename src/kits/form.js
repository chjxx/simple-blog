const formidable = require('formidable');

// 配置处理上传表单
module.exports = app => {
  app.use((req, res, next) => {
    let form = new formidable.IncomingForm();

    form.uploadDir = req.locals.uploadDir;
    form.keepExtensions = true;

    form.parse(req, (e, fields, files) => {
      if (e) {
        return next(e);
      } else {
        req = Object.assign(req, { fields, files });

        return next();
      }
    });
  });
};
