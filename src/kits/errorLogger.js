const expressWinston = require('express-winston');
const path = require('path');
const winston = require('winston');

// 错误拦截处理
module.exports = app => {
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
};
