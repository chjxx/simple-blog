const path = require('path');

module.exports = {
  // 存储根路径（绝对路径）
  uploadRootPath: path.resolve('./assets'),
  // 各类型存储的相对路径
  uploadPath: {
    image: {
      avatar: './images/avatars',
      resource: './images/resources'
    },
    others: './others'
  },
  // 资源的公共路径（绝对路径）：在云服务器就用云服务器的地址
  accessPublicPath: '/assets',
  // 各类型访问的相对路径
  accessPath: {
    image: {
      avatar: '/images/avatars/',
      resource: '/images/resources/'
    },
    others: '/others/'
  }
};