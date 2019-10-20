const path = require('path');

module.exports = {
  https: {
    host: '0.0.0.0',
    port: 3000,
    ssl: {
      key: path.resolve('./src/lib/ssl/key.pem'),
      cert: path.resolve('./src/lib/ssl/cert.pem'),
      passphrase: '19616414'
    }
  },
  http: {
    host: '0.0.0.0',
    port: 3001
  },
  session: {
    // cookie 中保存 session id 的字段名称
    key: 'blog',
    // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    secret: 'blog',
    // 过期时间
    maxAge: 1209600000
  },
  // 数据库地址
  mongodb: 'mongodb://localhost:27017/blog',
  // 博客管理员数量上限
  ADMIN_MAXIMUM: 1,
  // 服务器处理请求后返回的数据的状态码
  responseCode: {
    SUCCESS: 0,
    ERROR: 1
  }
};