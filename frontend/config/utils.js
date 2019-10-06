/**
 * 配置文件所需要的工具函数
 */

const path = require('path');
const config = require('./config');

// 项目根路径
const ROOTPATH = path.resolve(__dirname, '..', '..');

exports.ROOTPATH = ROOTPATH;

/**
 * 将传入的相对路径加工为以项目根路径为基础的绝对路径
 * @param  {String} _path
 * @return {String} 以项目根路径为基础的绝对路径
 */
exports.resolve = _path => {
  return _path ? path.resolve(ROOTPATH, _path) : ROOTPATH;
};

/**
 * 为传入的相对路径补充静态文件目录
 * @param  {String} _path
 * @return {String} 补充静态文件目录后的相对路径
 */
exports.completeStaticPath = _path => {

  if (!_path) return;

  let outputStaticPath = config[process.env.NODE_ENV].outputStaticPath;

  return path.posix.join(outputStaticPath, _path);
};
