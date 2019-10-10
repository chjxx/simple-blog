/**
 * 各种工具
 */

/**
 * querystring处理工具
 */
export let qs = {
  /**
   * 字符串化(注意：只处理传入对象第一层属性)
   * @param  {Object} data
   * @return {string}
   */
  stringify(data) {
    // 如果传入数组不是javascript对象的话则不处理
    if (notTypes(data, ['Object'])) return;

    return Object.keys(data).reduce((querystring, key) => {
      let val = data[key];
      let snippet = '';

      // 当val不是Number、String、Boolean、Array其中一个的话则不处理
      if (notTypes(val, ['Number', 'String', 'Array', 'Boolean'])) return querystring;

      if (isType(val, 'Array')) {
        // 处理Array
        snippet = val.reduce((str, item) => {
          // 当item不是Number、String、Boolean其中一个的话则不处理
          if (notTypes(item, ['Number', 'String', 'Boolean'])) return str;

          if (str === '') {
            return `${key}=${item}`;
          } else {
            return `${str}&${key}=${item}`;
          }
        }, '');
      } else {
        // 处理Number、String、Boolean
        snippet = `${key}=${val}`;
      }

      if (querystring === '') {
        return snippet;
      } else {
        return `${querystring}&${snippet}`;
      }
    }, '');
  }
};

/**
 * 深拷贝
 * @param  {object|array|string|number|boolean} obj
 * @param  {Map}
 * @return {object|array|string|number|boolean}
 */
export function cloneDeep(data, map = new Map()) {
  if (isSomeType(data, ['Object', 'Array'])) {
    let dataType = getType(data);
    // 初始化当前拷贝层数据
    let target = (dataType === 'Object') ? {} : [];
    // 如果map中已有该引用数据，则直接返回该引用
    if (map.get(data)) {
      return map.get(data);
    }
    // 添加新的独一无二的引用
    map.set(data, target);

    let keys = Object.keys(data);
    let keyLength = keys.length;
    let i = -1;

    while (++i < keyLength) {
      target[keys[i]] = cloneDeep(data[keys[i]], map);
    }

    return target;
  } else {
    return data;
  }
}

/**
 * 生成字符串
 * @param  {string} cell 字符
 * @param  {number} num 长度
 * @return {string}
 */
export function generateString(cell, num) {
  return Array.from({ length: num })
    .map(() => cell)
    .join('');
}

/**
 * 将传入的键值对转为可以附加在链接上上传到服务端的query
 * @param  {Object} pair 键值对
 * @return {string} queyr
 */
export function convertToQuery(pair) {
  let pairString = qs.stringify(pair);
  // 如果pairString为 ''，则不加 '?'
  pairString = pairString ? ('?' + pairString) : '';

  return pairString;
}

/**
 * 从后往前遍历数组
 * @param  {Array}  arr
 * @param  {Function} fn 遍历过程中执行的函数
 */
export function forEachRight(arr, fn) {
  for (let i = arr.length - 1; i >= 0; i--) {
    fn(arr[i], i, arr);
  }
}

/**
 * 字符串首字母大写化
 * @param  {string} str
 * @return {string}
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 查询变量类型
 * @param  {any} obj 任何变量
 * @return {string} 类型名字符串
 */
export function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * 判断变量类型
 * @param  {any}  data 需要判断的变量
 * @param  {string}  expectedType 期望的类型
 * @return {Boolean}
 */
export function isType(data, expectedType) {
  let actualType = getType(data);

  return expectedType === actualType;
}

/**
 * 判断变量是否为几个类型中的其中一种
 * @param  {any}  data 需要判断的变量
 * @param  {Array}  types 类型数组
 * @return {Boolean}
 */
export function isSomeType(data, types) {
  // 如果不是数组则不处理
  if (!isType(types, 'Array')) return;

  return types.some(type => isType(data, type));
}

/**
 * 判断变量是否不为某几个类型
 * @param  {any}  data 需要判断的变量
 * @param  {Array}  types 类型数组
 * @return {Boolean}
 */
export function notTypes(data, types) {
  return !isSomeType(data, types);
}

/**
 * 对需要转为正则表达式的字符串预先做去歧义
 * @param  {string} string 需要转为正则表达式的字符串
 * @return {string}
 */
export function escapeREString(string) {
  // 匹配在正则表达式中有特殊作用的符号，主要是用来消除以任何字符串生成的正则表达式中的歧义
  const escapeRE = /([\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/])/g;

  return string.replace(escapeRE, '\\$1');
}
/**
 * 截流函数, 限制函数在多少时间内最多执行一次
 * @param  {Function} fn 要执行的函数
 * @param  {number}   threshold 限制时长（毫秒）
 * @return {[type]}
 */
export function throttle(fn, threshold) {
  let timer;
  let start = new Date();

  threshold = threshold || 200;
  // 返回函数
  return (...args) => {
    let curr = new Date();
    // 清除预留执行的timer
    clearTimeout(timer);
    // 如果开始时间和当前时间间隔比限制的时间长，则执行函数
    if ((curr - start) >= threshold) {
      fn.apply(null, args);
      // 把当前时间设置为开始时间
      start = curr;
    } else {
      // 生成预留执行的timer
      timer = setTimeout(() => {
        fn.apply(null, args);
      }, threshold);
    }
  };
}