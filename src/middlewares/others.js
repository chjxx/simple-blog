const f = require('../lib/file');

// 预设request属性的中间件
exports.presetProperty = (req, res, next) => {
  // 初始化request生命周期自定义变量
  req.locals = {};
  // 根据访问路径确定上传的文件存放的文件夹
  for (let item of f.accessPathMap) {
    if (item[0].test(req.path)) {
      req.locals.uploadDir = item[1];

      break;
    }
  }

  return next();
};

/**
 * 函数报错拦截中间件，主要是用来拦截异步函数的报错，统一传给后面的Error处理中间件
 * @param  {Function} asyncFn 异步函数
 */
exports.errorInterceptor = asyncFn => (req, res, next) => {
  Promise.resolve(asyncFn(req, res, next)).catch(err => next(err));
};

// 如果之前的中间件有报错，则删除该request上传到服务器的文件
exports.deleteRedundantFile = (err, req, res, next) => {
  let fileKeys = Object.keys(req.files);

  if (fileKeys.length) {
    fileKeys.forEach(key => {
      f.delete(req.files[key].path);
    });
  }

  return next(err);
};