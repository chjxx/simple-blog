const resCode = require('../config').responseCode;

/* ----------------------------Operating Error--------------------------------- */

/**
 * 操作错误，即良性错误，无关于代码设计问题
 * @param {string} type 错误类型
 * @param {string} message 错误信息
 * @param {number} httpStatus response的状态码
 * @param {nunber} responseCode response返回内容中的错误代码
 * @param {string} responseMessage response返回内容中的错误信息
 */
class OperatingError extends Error {
  constructor(type, message, httpStatus, responseCode, responseMessage) {
    super(message);

    this.type = type;
    this.httpStatus = httpStatus;
    this.httpMessageCode = responseCode;
    this.httpMessage = responseMessage;
  }
}

/**
 * Model中属性验证错误
 * @param {string} key 错误属性
 * @param {string} message 错误信息
 */
class ModelValidationError extends OperatingError {
  constructor(key, message) {
    super('ModelValidationError', message, 200, resCode.ERROR, message);

    this.key = key;
  }
}

/**
 * Mongoose属性类型转换错误
 * @param {string} key 错误属性
 * @param {string} message 错误信息
 */
class ModelCastError extends OperatingError {
  constructor(key, message) {
    super('ModelCastError', message, 200, resCode.ERROR, '信息类型错误, 错误码10000!');

    this.key = key;
  }
}

/**
 * Model处理结果的错误
 * @param {string} message 错误信息
 */
class ModelResultError extends OperatingError {
  constructor(message) {
    super('ModelResultError', message, 200, resCode.ERROR, message);
  }
}

/**
 * 中间件错误
 * @param {string} message 错误信息
 */
class MiddlewareError extends OperatingError {
  constructor(message) {
    super('MiddlewareError', message, 200, resCode.ERROR, message);
  }
}

/* -------------------------Programing Error-------------------------------------- */

/**
 * 程序错误，代码设计缺陷
 * @param {string} type 错误类型
 * @param {string} message 错误信息
 */
class ProgramingError extends Error {
  constructor(type, message) {
    super(message);

    this.type = type;
  }
}

/**
 * Model执行过程中未预料到的错误
 * @param {Object} error 原始错误对象
 */
class ModelUnexpectedError extends ProgramingError {
  constructor(error) {
    super('ModelUnexpectedError', error.message);

    this._error = error;
  }
}

/**
 * 函数参数错误
 * @param {Object} error 原始错误对象
 */
class ParamTypeError extends ProgramingError {
  constructor(error) {
    super('ParamTypeError', `The "${error.key}" argument must be type '${error.expectedType}'. Received type '${error.actualType}'`);

    this._error = error;
  }
}

module.exports = {
  OperatingError,
  ModelValidationError,
  ModelCastError,
  ModelUnexpectedError,
  ModelResultError,
  MiddlewareError,
  ParamTypeError
};