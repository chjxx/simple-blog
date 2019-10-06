const path = require('path');
const express = require('express');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config');
const formidable = require('formidable');
const winston = require('winston');
const expressWinston = require('express-winston');
const compression = require('compression');
const webpack = require('./lib/webpack');
const { expressLogger } = require('./lib/loggers');

const routes = require('./routes');
const pkg = require('../package');
const { wwwAssetPath, assetRoot } = require('./lib/file');

const presetPropertyMiddleware = require('./middlewares/others').presetProperty;

const app = express();

if (process.env.NODE_ENV === 'development') {
  webpack(app);
} else {
  app.use(compression());
  // 设置静态文件目录
  app.use(express.static(wwwAssetPath, { maxAge: 31536000 }));
}
// 设置资源目录
app.use(assetRoot.route, express.static(assetRoot.path));

// 使用session中间件
app.use(
  session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false ，强制创建一个 session，即使用户没有登陆
    cookie: {
      maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({
      // 将 session 存储到 mongodb
      url: config.mongodb
    })
  })
);

// 初始化request生命周期自定义变量
app.use(presetPropertyMiddleware);
// 处理上传的表单
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
// 记录访问记录
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.File({
        filename: path.resolve('./logs/success.log')
      })
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
);
// 进入路由
routes(app);
// 记录错误信息
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.File({
        filename: path.resolve('./logs/error.log')
      })
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  })
);

const server = https
  .createServer(
    {
      key: fs.readFileSync('./security/key.pem', 'utf8'),
      cert: fs.readFileSync('./security/cert.pem', 'utf8'),
      passphrase: '19616414'
    },
    app
  )
  .listen(config.port, config.host, () => {
    expressLogger.info(
      `${pkg.name} is listening on site -> https://${config.host}:${config.port}`
    );
  });

const redirectServer = express();

redirectServer.use(function(req, res, next) {
  res.redirect(`https://${req.hostname}:${config.port}${req.originalUrl}`);
});

redirectServer.listen(3005, config.host, () => {
  expressLogger.info(`Redirect server is listening on site -> http://${config.host}:3005`);
});
