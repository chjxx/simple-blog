const path = require('path');

const otherAssetConfig = {
  uploadRoot: path.resolve('./assets'),
  wwwAssetPath: path.resolve('./www'),
  assetRoot: {
    route: '/assets',
    path: path.resolve('./assets')
  }
};

// 上传文件存放目录（确定文件上传时存放的地方）
const uploadPaths = {
  image: {
    avatar: path.resolve(otherAssetConfig.uploadRoot, './images/avatars'),
    resource: path.resolve(otherAssetConfig.uploadRoot, './images/resources')
  },
  others: path.resolve(otherAssetConfig.uploadRoot, './others')
};

// 文件访问路径（客户端获取文件的路径地址，该路径地址加上文件名就是文件获取地址）
const assetPaths = {
  image: {
    avatar: '/assets/images/avatars/',
    resource: '/assets/images/resources/'
  },
  others: '/assets/others/'
};

module.exports = {
  uploadPaths,
  assetPaths,
  otherAssetConfig
};