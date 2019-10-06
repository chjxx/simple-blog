const fs = require('fs');
const path = require('path');
const { isType } = require('../utils');

/**
 * uploadPaths 上传文件存放目录（确定文件上传时存放的地方）
 * assetPaths 文件访问路径（客户端获取文件的路径地址，
 *            该路径地址加上文件名就是文件获取地址）
 * otherAssetConfig 其它配置
 */
const { uploadPaths, assetPaths, otherAssetConfig } = require('./config');

const image = {
  // 补充LOGO路径
  fillLogoPath: fillImagePath.bind(null, 'avatar'),
  // 补充头像路径
  fillAvatarPath: fillImagePath.bind(null, 'avatar'),
  // 补充文章封面路径
  fillCoverPath: fillImagePath.bind(null, 'resource'),
  // 补充资源路径
  fillResourcePath: fillImagePath.bind(null, 'resource'),
  // 删除LOGO
  deleteLogo: deleteImage.bind(null, 'avatar'),
  // 删除头像
  deleteAvatar: deleteImage.bind(null, 'avatar'),
  // 删除文章封面
  deleteCover: deleteImage.bind(null, 'resource'),
  // 删除资源
  deleteResource: deleteImage.bind(null, 'resource'),
  delete: deleteFile
};

// 访问的路径与上传的文件存放的路径关系的Map
const AccessPathParternMap = new Map([
  [/^\/api\/(bloginfo|signup|account)/, uploadPaths.image.avatar],
  [/^\/api\/(posts|images)/, uploadPaths.image.resource],
  [/[\s\S]*/, uploadPaths.others]
]);

module.exports = {
  AccessPathParternMap,
  wwwAssetPath: otherAssetConfig.wwwAssetPath,
  assetRoot: otherAssetConfig.assetRoot,
  image
};

init(uploadPaths);

/**
 * 初始化文件管理模块
 * @param  {Object} uploadPaths 上传文件存放路径
 */
function init(uploadPaths) {
  setUpUploadDirs(uploadPaths);

  /**
   * 检查及初始化资源存放目录
   * @param {Object} uploadPaths
   */
  function setUpUploadDirs(uploadPaths) {
    rolling(uploadPaths);

    /**
     * 递归属性
     * @param  {Object} uploadPaths
     */
    function rolling(uploadPaths) {
      Object.keys(uploadPaths).forEach(key => {
        let val = uploadPaths[key];

        if (isType(val, 'Object')) {
          rolling(val);
        } else if (isType(val, 'String')) {
          fs.mkdirSync(val, { recursive: true });
        }
      });
    }
  }
}

/**
 * 填充图片文件路径（数据库只保留文件名，所以从数据库取出来的数据需要
 * 经过填充路径才能被客户端使用）
 * @param  {string} type 图片类型
 * @param  {string} fileName
 * @return {string}
 */
function fillImagePath(type, fileName) {
  return assetPaths.image[type] + fileName;
}

/**
 * 删除图片文件
 * @param  {string} type
 * @param  {string} fileName
 */
function deleteImage(type, fileName) {
  deleteFile(path.resolve(uploadPaths.image[type], fileName));
}

/**
 * 删除文件
 * @param  {string} path
 */
function deleteFile(path) {
  try {
    fs.unlinkSync(path);
  } catch (e) {}
}