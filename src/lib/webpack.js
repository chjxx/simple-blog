module.exports = app => {
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
};