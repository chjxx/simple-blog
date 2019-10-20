const Model = require('../models');
const utils = require('../lib/utils');
const intercept = require('./intercept');
const { MiddlewareError, ParamTypeError } = require('../lib/ExtendError');

// 检查是否已经登陆过账户
exports.login = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return next(new MiddlewareError('未登陆账户'));
  }
};

// 检查是否未登陆过账户
exports.notLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(new MiddlewareError('已登陆过账户！'));
  } else {
    return next();
  }
};

// 检查是否为管理员账户
exports.admin = intercept.error(async (req, res, next) => {
  await Model.user.isAdmin(req.session.user);

  next();
});

// 检查字段的中间件
exports.field = (options) => {
  let paramType = {
    options: 'Object',
    'options.key': 'String',
    'options.fields': 'Object',
    'options.errorMessage': 'String'
  };

  let paramError = utils.checkPropertyType({ options }, paramType);

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  let { key, fields, errorMessage } = options;

  return (req, res, next) => {
    let propertyError = utils.checkPropertyType(req.locals[key], fields);

    if (propertyError) {
      return next(new MiddlewareError(errorMessage));
    } else {
      return next();
    }
  };
};