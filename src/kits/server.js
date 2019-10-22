const https = require('https');
const selfsigned = require('selfsigned');
const config = require('../config');
const pkg = require('../../package');
const logger = require('../lib/loggers');

// 创建及开启APP
module.exports = app => {
  const attrs = [{ name: 'commonName', value: 'example.com' }];
  const pems = selfsigned.generate(attrs, { days: 365 });

  if (pems) {
    https
      .createServer(
        {
          key: pems.private,
          cert: pems.cert
        },
        app
      )
      .listen(config.https.port, config.https.host, () => {
        logger.expressLogger.info(
          `${pkg.name.toUpperCase()} HTTPS server is listening on site -> https://${
            config.https.host
          }:${config.https.port}`
        );
      });
  } else {
    app.listen(config.http.port, config.http.host, () => {
      logger.expressLogger.info(
        `${pkg.name.toUpperCase()} HTTP server is listening on site -> http://${
          config.http.host
        }:${config.http.port}`
      );
    });
  }
};
