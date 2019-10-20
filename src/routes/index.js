module.exports = function(app) {
  // 处理静态文件请求
  app.use(require('./static'));
  // 处理数据库请求
  app.use('/api', require('./api'));
  // 处理上面路由没有处理的请求
  app.use(require('./other'));
  // 处理错误
  app.use(require('./error'));
};
