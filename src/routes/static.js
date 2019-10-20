const wwwStaticPath = require('../../frontend/config/webpack.base.conf').output.path;
const path = require('path');

// 处理除了api开头以外的路径
module.exports = (req, res, next) => {
  let pathHead = req.path.split('/')[1];
  if (pathHead !== 'api') {
    let filePath = path.resolve(wwwStaticPath, 'index.html');
    return res.sendFile(filePath, err => {
      if (err) {
        return next(err);
      }
    });
  } else {
    return next();
  }
};