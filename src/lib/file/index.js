const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const fileConfig = require('../../config/file');
const resolvePath = require('./path/resolve');
const simplifyPath = require('./path/simplify');
const del = require('./del');
// 初始化文件管理模块
init(fileConfig);

module.exports = {
  // 处理文件路径
  path: {
    resolve: resolvePath,
    simplify: simplifyPath
  },
  // 删除文件
  del,
  // 文件模块的配置
  config: fileConfig,
  // 访问的路径与上传的文件存放的路径关系的Map
  accessPathMap: new Map([
    [/^\/api\/(bloginfo|signup|account)/, resolvePath.resolveImageUploadPath('avatar', '')],
    [/^\/api\/(posts|images)/, resolvePath.resolveImageUploadPath('resource', '')],
    [/[\s\S]*/, fileConfig.uploadRootPath + fileConfig.uploadPath.others]
  ])
};

/**
 * 初始化文件管理模块
 * @param  {Object} uploadPath 上传文件存放路径
 */
function init(config) {
  let uploadPathList = generatePathList(config.uploadRootPath, config.uploadPath);

  createUploadDirs(uploadPathList);

  /**
   * 检查及初始化资源存放目录
   * @param {Object} uploadPathList
   */
  function createUploadDirs(uploadPathList) {
    return uploadPathList.forEach(p => {
      fs.mkdirSync(p, { recursive: true });
    });
  }
}

/**
 * 根据给定数据生成绝对路径列表
 * @param  {string} rootP 根路径
 * @param  {Object} dirs 相对路径对象
 * @return {Array} 绝对路径列表
 */
function generatePathList(rootP, dirs) {
  return rolling(rootP, dirs);

  function rolling(rootP, dirs, pList) {
    pList = pList || [];

    Object.keys(dirs).forEach(key => {
      let dir = dirs[key];

      if (utils.isType(dir, 'Object')) {
        rolling(rootP, dir, pList);
      } else if (utils.isType(dir, 'String')) {
        pList.push(path.resolve(rootP, dir));
      }
    });

    return pList;
  }
}