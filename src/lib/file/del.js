const fs = require('fs');
const resolveImageUploadPath = require('./path/resolve').resolveImageUploadPath;

exports.image = {
  // 删除LOGO
  logo: delImage.bind(null, 'avatar'),
  // 删除头像
  avatar: delImage.bind(null, 'avatar'),
  // 删除文章封面
  cover: delImage.bind(null, 'resource'),
  // 删除资源
  resource: delImage.bind(null, 'resource')
};

exports.file = delFile;

/**
 * 删除图片文件
 * @param  {string} type
 * @param  {string} fileName
 */
function delImage(type, fileName) {
  let filePath = resolveImageUploadPath(type, fileName);

  delFile(filePath);
}

/**
 * 删除文件
 * @param  {string} path
 */
function delFile(path) {
  try {
    fs.unlinkSync(path);
  } catch (e) {}
}

exports.delImage = delImage;
exports.delFile = delFile;