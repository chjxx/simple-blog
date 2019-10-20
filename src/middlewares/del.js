const f = require('../lib/file');
// 如果之前的中间件有报错，则删除该request上传到服务器的文件
exports.redundantFile = (err, req, res, next) => {
  let fileKeys = Object.keys(req.files);

  if (fileKeys.length) {
    fileKeys.forEach(key => {
      f.del.file(req.files[key].path);
    });
  }

  return next(err);
};