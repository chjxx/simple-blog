/**
 * 函数报错拦截中间件，主要是用来拦截异步函数的报错，统一传给后面的Error处理中间件
 * @param  {Function} asyncFn 异步函数
 */
exports.error = asyncFn => (req, res, next) => {
  Promise.resolve(asyncFn(req, res, next)).catch(err => next(err));
};