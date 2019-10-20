const MongooseError = require('mongoose').Error;
const utils = require('../../lib/utils');
const { ModelValidationError, ModelCastError, ModelUnexpectedError } = require('../../lib/ExtendError');

module.exports = (err) => {
  // mongoose 错误
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
  } else {
    throw err;
  }
};