const utils = require('../../utils');
const resolveImageAccessPath = require('./resolve').resolveImageAccessPath;

// 数据库数据返回给客户端时需要补全资源文件路径供客户端访问，客户端请求数据后提交修改的数据中资源便会带有之前补全的路径，所以在保存到数据库之前应该先调用以下函数剔除这些路径，只留文件名
exports.image = {
  // 访问路径
  access: {
    // 去年logo绝对路径
    logo: simplifyImageAccessPath.bind(null, 'avatar'),
    // 去年头像绝对路径
    avatar: simplifyImageAccessPath.bind(null, 'avatar'),
    // 去年文章封面绝对路径
    cover: simplifyImageAccessPath.bind(null, 'resource'),
    // 去年资源绝对路径
    resource: simplifyImageAccessPath.bind(null, 'resource')
  }
};

/**
 * 剔除文件路径字符串中多余的字符串，只保留要存放到数据库的字符串
 * @param  {string} type 文件类型
 * @param  {string} p 文件路径
 * @return {string}
 */
function simplifyImageAccessPath(type, p) {
  let imageAccessPublicPath = resolveImageAccessPath(type, '');

  const accessPublicPathRE = new RegExp(utils.escapeREString(imageAccessPublicPath), 'g');

  return p.replace(accessPublicPathRE, '');
}

exports.simplifyImageAccessPath = simplifyImageAccessPath;