const config = require('../config');
const ExtendError = require('../lib/ExtendError');

module.exports = (err, req, res, next) => {
  // 判断是否为操作性错误（即用户输入有误）
  if (err instanceof ExtendError.OperatingError) {
    // 一般进这里的错误都是良性错误，如用户信息不完整等错误
    return res
      .status(err.httpStatus)
      .json({
        code: err.httpMessageCode,
        message: err.httpMessage
      });
  } else {
    // 到这里的错误一般都是程序流程等错误而造成的，一般不应该出现，所以返回500
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          code: config.responseCode.ERROR,
          message: '未知错误!'
        });
    }
    // 传递下去，记录到错误日志
    return next(err);
  }
};