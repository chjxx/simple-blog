const path = require('path');
const { responseCode } = require('../config');
const { wwwAssetPath } = require('../lib/file');
const { OperatingError } = require('../lib/ExtendError');

module.exports = function(app) {
  /**
   * 处理非 api 开头的链接请求，返回网站主页
   * @param  {Object} (req, res, next)
   * @return {[type]}
   */
  app.use((req, res, next) => {
    let pathHead = req.path.split('/')[1];

    if (pathHead !== 'api') {
      let filePath = path.resolve(wwwAssetPath, 'index.html');
      return res.sendFile(filePath, err => {
        if (err) {
          return next(err);
        }
      });
    } else {
      return next();
    }
  });
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache');

    return next();
  });
  app.use('/api/bloginfo', require('./bloginfo'));
  app.use('/api/signup', require('./signup'));
  app.use('/api/signin', require('./signin'));
  app.use('/api/signout', require('./signout'));
  app.use('/api/account', require('./account'));
  app.use('/api/posts', require('./posts'));
  app.use('/api/tags', require('./tags'));
  app.use('/api/images', require('./images'));
  // 如果上面的路由没有响应则返回404
  app.use((req, res, next) => {
    if (!res.headersSent) {
      res.status(404).end();
    }
  });
  // 错误的处理
  app.use((err, req, res, next) => {
    // 判断是否为操作性错误（即用户输入有误）
    if (err instanceof OperatingError) {
      // 一般进这里的错误都是良性错误，如用户信息不完整等错误
      return res
        .status(err.httpStatus)
        .json({
          code: err.httpMessageCode,
          message: err.httpMessage
        });
    } else {
      // 到这里的错误一般都是程序流程等错误而造成的，一般不应该出现，所以返回500
      if (!res.headersSent) {
        res
          .status(500)
          .json({
            code: responseCode.ERROR,
            message: '未知错误!'
          });
      }
      // 传递下去，记录到错误日志
      return next(err);
    }
  });
};
