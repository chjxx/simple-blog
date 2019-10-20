const https = require('https');
const express = require('express');
const fs = require('fs');
const config = require('../config');
const pkg = require('../../package');
const logger = require('../lib/loggers');

// 创建及开启APP
module.exports = app => {
  https
    .createServer(
      {
        key: fs.readFileSync(config.https.ssl.key, 'utf8'),
        cert: fs.readFileSync(config.https.ssl.cert, 'utf8'),
        passphrase: config.https.ssl.passphrase
      },
      app
    )
    .listen(config.https.port, config.https.host, () => {
      logger.expressLogger.info(
        `${pkg.name.toUpperCase()} HTTPS server is listening on site -> https://${config.https.host}:${config.https.port}`
      );
    });

  // 创建重定向HTTP服务器
  const httpApp = express();

  httpApp.use(function(req, res, next) {
    res.redirect(`https://${req.hostname}:${config.port}${req.originalUrl}`);
  });

  httpApp.listen(config.http.port, config.http.host, () => {
    logger.expressLogger.info(
      `${pkg.name.toUpperCase()} HTTP server is listening on site -> http://${
        config.http.host
      }:${config.http.port}`
    );
  });
};
