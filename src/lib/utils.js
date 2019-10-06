let { ParamTypeError } = require('./ExtendError');

/**
 * 生成链试调用Promise函数，函数执行时根据顺序执行传入的函数，上一个函数的执行结果为下一个函数的参数
 * @param  {Array} fns
 * @return {Pormise}
 */
exports.composeAsyncFunction = (...fns) => {
  return (...args) => {
    return fns.reduce((p, fn) => {
      if (p) {
        return p.then(fn);
      } else {
        return Promise.resolve(fn(...args));
      }
    }, null);
  };
};

/**
 * 绑定给定参数到给定函数的尾部
 * @param  {Function}  fn
 * @param  {Array} boundArgs
 * @return {Function}
 */
exports.bindTrailingArgs = (fn, ...boundArgs) => {
  return (...args) => {
    return fn(...args, ...boundArgs);
  };
};

/**
 * 判断变量类型
 * @param  {any}  data 需要判断的变量
 * @param  {string}  expectedType 期望的类型
 * @return {Boolean}
 */
exports.isType = (data, expectedType) => {
  let actualType = exports.getType(data);

  return expectedType === actualType;
};

/**
 * 判断变量是否为几个类型中的其中一种
 * @param  {any}  data 需要判断的变量
 * @param  {Array}  types 类型数组
 * @return {Boolean}
 */
exports.isSomeType = (data, types) => {
  // 如果不是数组则不处理
  if (!exports.isType(types, 'Array')) {
    throw new ParamTypeError({
      key: 'types',
      expectedType: 'Array',
      actualType: exports.getType(types)
    });
  }

  return types.some(type => exports.isType(data, type));
};

exports.notType = (data, type) => {
  return !exports.isType(data, type);
};

/**
 * 判断变量是否不为某几个类型
 * @param  {any}  data 需要判断的变量
 * @param  {Array}  types 类型数组
 * @return {Boolean}
 */
exports.notTypes = (data, types) => {
  return !exports.isSomeType(data, types);
};

/**
 * 查询变量类型
 * @param  {any} obj 任何变量
 * @return {string} 类型名字符串
 */
exports.getType = obj => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * 复制指定属性
 * @param  {Object} originObj 源对象
 * @param  {Array} fields 要复制的属性名
 * @param  {Object|Undefined} targetObj 目标对象
 * @return {Object}
 */
exports.copyFields = (originObj, fields, targetObj) => {
  let paramError = exports.checkPropertyType({
    originObj,
    targetObj,
    fields
  }, {
    originObj: 'Object',
    targetObj: 'Object|Undefined',
    fields: 'Array'
  });
  // 检查参数
  if (paramError) {
    throw new ParamTypeError(paramError);
  }
  // 目标对象确定
  targetObj = targetObj || {};

  fields.forEach(key => {
    let val = originObj[key];

    if (val !== undefined) {
      targetObj[key] = val;
    }
  });

  return targetObj;
};

/**
 * 解析为JSON值的属性
 * @param  {Object} data 数据
 * @param  {Array} keys 要解析的属性
 */
exports.parseJSONFields = (data, keys) => {
  let paramError = exports.checkPropertyType({
    data,
    keys
  }, {
    data: 'Object',
    keys: 'Array'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  keys.forEach(key => {
    if (data[key]) {
      data[key] = JSON.parse(data[key]);
    }
  });
};

/**
 * 判断两个数组值是否一致
 * @param  {Array} aArr A数组
 * @param  {Array} bArr B数组
 * @param  {boolean}
 */
exports.sameArrayVal = (aArr, bArr) => {
  let paramError = exports.checkPropertyType({
    aArr,
    bArr
  }, {
    aArr: 'Array',
    bArr: 'Array'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  if (aArr.length !== bArr.length) {
    return false;
  }

  let bArrCopy = bArr.concat();

  return aArr.every(key => {
    let bKeyIndex = bArrCopy.indexOf(key);

    if (bKeyIndex !== -1) {
      bArrCopy.splice(bKeyIndex, 1);

      return true;
    } else {
      return false;
    }
  });
};

/**
 * 检查属性类型
 * @param  {Object} data 数据
 * @param  {Object} fields 要检查的数组
 * @return {Undefined|Error}
 */
exports.checkPropertyType = (data, fields) => {
  let { isType, notTypes, isSomeType, getType } = exports;

  let paramError = check({
    data,
    fields
  }, {
    data: 'Object',
    fields: 'Object'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  return check(data, fields);

  function check(data, fields) {
    let errorKey = Object.keys(fields).find(key => {
      // 获取值
      let val = getDeepPropertyVal(data, key);
      // 获取期望类型
      let type = fields[key];

      // 如果类型值不是string或者function类型则报错返回
      if (notTypes(type, ['String', 'Object'])) {
        throw new ParamTypeError({
          key: type,
          expectedType: 'String|Object',
          actualType: getType(type)
        });
      }
      // 如果类型值是字符串
      if (isType(type, 'String')) {
        // 将组合类型值分解
        type = type.split('|');

        return !isSomeType(val, type);
      } else {
        // 如果类型值是对象
        if (exports.isType(type.expected, 'String') && exports.isType(type.test, 'Function')) {
          return !type.test(val);
        } else {
          // 如果对象两个属性填类型不对则报错
          throw new ParamTypeError({
            key: type,
            expectedType: 'String&&Object',
            actualType: getType(type.expected) + '&&' + getType(type.test)
          });
        }
      }
    });

    if (errorKey) {
      return {
        key: errorKey,
        expectedType: isType(fields[errorKey], 'String') ? fields[errorKey] : fields[errorKey].expected,
        actualType: getType(getDeepPropertyVal(data, errorKey))
      };
    } else {
      return null;
    }

    function getDeepPropertyVal(data, deepProperty) {
      return deepProperty.split('.').reduce((data, prop) => {
        return isType(data, 'Object') ? data[prop] : undefined;
      }, data);
    }
  }
};
