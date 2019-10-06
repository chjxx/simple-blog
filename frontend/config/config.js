module.exports = {
  development: {
    // 静态文件存放目录, 相对于output.path（例如output.path的路径为 'E:\demo\', 静态文件的产出目录为 'E:\demo\static'）
    outputStaticPath: 'static',
    // output.publicPath
    outputPublicPath: '/',
    // output.fileName
    outputFilename: 'scripts/[name].[hash].js',
    // output.chunkFilename
    outputChunkFilename: 'scripts/[name].[hash].js',
    devtool: 'eval-source-map'
  },
  production: {
    // 静态文件存放目录, 相对于output.path（例如output.path的路径为 'E:\demo\', 静态文件的产出目录为 'E:\demo\static'）
    outputStaticPath: 'static',
    // output.publicPath
    outputPublicPath: '/',
    // output.fileName
    outputFilename: 'scripts/[name].[chunkhash].js',
    // output.chunkFilename
    outputChunkFilename: 'scripts/[name].[chunkhash].js',
    devtool: ''
  }
};