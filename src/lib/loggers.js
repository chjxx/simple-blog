const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const consoleFormat = printf(({ timestamp, level, label, message }) => {
  return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}`;
});

const mongooseLogger = createLogger({
  format: combine(
    timestamp({
      format: new Date().toLocaleString()
    }),
    label({ label: 'Mongoose' }),
    consoleFormat
  ),
  transports: [new transports.Console()]
});

const expressLogger = createLogger({
  format: combine(
    timestamp({
      format: new Date().toLocaleString()
    }),
    label({ label: 'Express' }),
    consoleFormat
  ),
  transports: [new transports.Console()]
});

module.exports = {
  mongooseLogger,
  expressLogger
};