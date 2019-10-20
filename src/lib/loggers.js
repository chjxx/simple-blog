const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, printf } = format;
// 日志类型固定12个字符
const TYPE_STRING_LENGTH = 12;

const costomMessage = printf(info => {
  // 目前类型的长度
  let curTypeStringLength = info.label.length + info.level.length;
  // 应该添加多长的空格
  let spaceSnippetLength = TYPE_STRING_LENGTH - curTypeStringLength;
  let spaceSnippet;
  // 如果需要空格则添加
  if (spaceSnippetLength > 0) {
    spaceSnippet = Array.from({ length: spaceSnippetLength }).reduce(a => a + ' ', '');
  }

  info.message = `${info.timestamp} [${info.label} ${info.level.toUpperCase()}]:${spaceSnippet} ${info.message}`;

  return info;
});

const printMessage = printf(info => {
  return info.message;
});

const mongooseLogger = createLogger({
  format: combine(
    timestamp({
      format: new Date().toLocaleString()
    }),
    label({ label: 'Mongo' }),
    costomMessage,
    colorize({ all: true }),
    printMessage
  ),
  transports: [new transports.Console()]
});

const expressLogger = createLogger({
  format: combine(
    timestamp({
      format: new Date().toLocaleString()
    }),
    label({ label: 'Expre' }),
    costomMessage,
    colorize({ all: true }),
    printMessage
  ),
  transports: [new transports.Console()]
});

module.exports = {
  mongooseLogger,
  expressLogger
};