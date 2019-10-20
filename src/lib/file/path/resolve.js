const path = require('path');
const fileConfig = require('../../../config/file');

// 补全图片访问链接，一般数据库查询信息后需要调用这些函数补全链接，客户端才能访问到资源
exports.image = {
  // 访问路径
  access: {
    // 补全logo路径
    logo: resolveImageAccessPath.bind(null, 'avatar'),
    // 补全头像路径
    avatar: resolveImageAccessPath.bind(null, 'avatar'),
    // 补全文章封面路径
    cover: resolveImageAccessPath.bind(null, 'resource'),
    // 补全资源文件路径
    resource: resolveImageAccessPath.bind(null, 'resource')
  }
};

/**
 * 填充图片文件路径（数据库只保留文件名，所以从数据库取出来的数据需要
 * 经过填充路径才能被客户端使用）
 * @param  {string} type 图片类型
 * @param  {string} fileName
 * @return {string}
 */
function resolveImageAccessPath(type, fileName) {
  return fileConfig.accessPublicPath + fileConfig.accessPath.image[type] + fileName;
}

/**
 * 生成对应类型文件放置的文件夹位置的绝对路径
 * @param  {string} type 图片类型
 * @param  {string} fileName
 * @return {string} 返回相应类型文件夹放置的绝对路径
 */
function resolveImageUploadPath(type, fileName) {
  return path.resolve(fileConfig.uploadRootPath, fileConfig.uploadPath.image[type], fileName);
}

exports.resolveImageAccessPath = resolveImageAccessPath;
exports.resolveImageUploadPath = resolveImageUploadPath;