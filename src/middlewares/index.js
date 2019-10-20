// 检查数据中间件（检查账户登陆状态等）
exports.check = require('./check');
// 组织数据中间件（组织好用户提交的数据）
exports.organize = require('./organize');
// 文章中间件（查询文章等）
exports.posts = require('./posts');
// 拦截器中间件（拦截报错等）
exports.intercept = require('./intercept');
// 删除中间件（删除多余文件等）
exports.del = require('./del');