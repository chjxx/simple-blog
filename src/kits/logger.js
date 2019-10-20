const expressWinston = require('express-winston');
const path = require('path');
const winston = require('winston');

// 访问来源信息登记
module.exports = app => {
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
};