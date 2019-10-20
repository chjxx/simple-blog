const express = require('express');

// 配置静态文件
module.exports = app => {
  // 如果是development环境则通过webpack实时打包来提供静态文件
  if (process.env.NODE_ENV === 'development') {
    let webpack = require('webpack');
    // webpack 开发模式中间件
    let webpackDevMiddleware = require('webpack-dev-middleware');
    // webpack 热更新中间件
    let webpackHotMiddleware = require('webpack-hot-middleware');
    let webpackDevConfig = require('../../frontend/config/webpack.dev.conf');

    let compiler = webpack(webpackDevConfig);

    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        writeToDisk: true,
        watchOptions: {
          ignored: ['node_modules']
        },
        stats: {
          colors: true
        }
      })
    );

    app.use(webpackHotMiddleware(compiler));
  } else {
    // 如果是development以外的环境则通过已配置好的静态文件目录提供静态文件
    let wwwStaticPath = require('../../frontend/config/webpack.base.conf').output.path;
    // 设置静态文件目录
    app.use(express.static(wwwStaticPath, { maxAge: 31536000 }));
  }
};
