const MongooseError = require('mongoose').Error;
const utils = require('../../lib/utils');
const { ModelValidationError, ModelCastError, ModelUnexpectedError } = require('../../lib/ExtendError');

module.exports = (err) => {
  let specificError;

  // 如果为mongoose错误
  if (err instanceof MongooseError) {
    let errorKey, error;

    if (utils.isType(err.errors, 'Object')) {
      // 取第一个错误处理
      errorKey = Object.keys(err.errors)[0];
      error = err.errors[errorKey];
    } else {
      if (utils.isType(err, 'Object')) {
        errorKey = err.path;
        error = err;
      } else {
        errorKey = '';
        error = err;
      }
    }

    if (error.name === 'ValidatorError') {
      throw new ModelValidationError(errorKey, error.message);
    } else if (error.name === 'CastError') {
      throw new ModelCastError(errorKey, error.message);
    } else {
      throw new ModelUnexpectedError(err);
    }
  } else if (err.name === 'MongoError') {
    // 如果为mongoDB错误
    if (err.code === 11000) {
      if (err.errmsg.indexOf('name') !== -1) {
        specificError = new ModelValidationError('name', '用户名已被注册！');
      } else if (err.errmsg.indexOf('email') !== -1) {
        specificError = new ModelValidationError('email', '邮箱已被注册！');
      } else {
        specificError = new ModelUnexpectedError(err);
      }
    } else {
      specificError = new ModelUnexpectedError(err);
    }
  } else {
    // 其它错误
    specificError = err;
  }

  throw specificError;
};