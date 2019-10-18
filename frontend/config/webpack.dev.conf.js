/**
 * webpack开发模式配置文件
 */

const webpack = require('webpack');
// webpack配置合并函数
const merge = require('webpack-merge');
// html文件生成插件，主要用于html生成，javascript、css等文件内联或链接注入
const HTMLPlugin = require('html-webpack-plugin');
// postcss插件（类似babel的presets-env插件），整合了autofixer、polyfills等
const PostcssPresetEnv = require('postcss-preset-env');
const baseWebpackConfig = require('./webpack.base.conf');
// webpack-hot-middleware（express插件）的配置
const HowMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  entry: {
    // 直接内联（注入）html文件的代码
    inlinesource: ['./frontend/src/common/scripts/inlinesource.js', HowMiddlewareScript],
    // 主要文件入口
    main: ['./frontend/src/index.js', HowMiddlewareScript]
  },
  module: {
    rules: [{
      test: /\.(scss|css)$/,
      use: [
        'vue-style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: () => [
              PostcssPresetEnv({ stage: 0 })
            ]
          }
        },
        'sass-loader'
      ]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLPlugin({ template: './frontend/index.html', favicon: './frontend/src/common/images/favicon.ico' })
  ]
});