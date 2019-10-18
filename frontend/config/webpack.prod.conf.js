/**
 * webpack生产模式配置文件
 */

// webpack配置合并函数
const merge = require('webpack-merge');
// html文件生成插件，主要用于html生成，javascript、css等文件内联或链接注入
const HTMLPlugin = require('html-webpack-plugin');
// 扩展html-webpack-plugin功能，用于将代码(webpack产出的)中的某一部分内联到html文件（html-webpack-plugin产出的）里
const HTMLInlineSourcePlugin = require('html-webpack-inline-source-plugin');
// javascript文件最小化插件
const TerserJSPlugin = require('terser-webpack-plugin');
// css文件最小化插件
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
// css提取插件，主要用于将wepback打包后的每个js文件中的css分别提取出来
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 统计文件生成插件，主要用于将webpack打包后的文件统计数据生成文件
const StatsPlugin = require('stats-webpack-plugin');
// momentjs本地化语言包移除插件，主要用于移除没有使用到的本地化语言包
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// postcss插件（类似babel的presets-env插件），整合了autofixer、polyfills等
const PostcssPresetEnv = require('postcss-preset-env');
const baseWebpackConfig = require('./webpack.base.conf');
const utils = require('./utils');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  entry: {
    // 直接内联（注入）html文件的代码
    inlinesource: './frontend/src/common/scripts/inlinesource.js',
    // 主要文件入口
    main: './frontend/src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  optimization: {
    // runtime单独为文件，
    runtimeChunk: true,
    // 生成以模块相对路径为基础的Hash作为模块ID，防止即使没有改变文件内容，每一次打包chunk文件名都与上次打包不一致，详见https://webpack.js.org/guides/caching/
    moduleIds: 'hashed',
    minimizer: [new OptimizeCssPlugin(), new TerserJSPlugin()],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new HTMLPlugin({
      template: './frontend/index.html',
      // 最小化html文件属性
      minify: {
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        ignoreCustomComments: true
      },
      // 内联文件匹配的正则表达式，配合html-webpack-inline-source-plugin使用，内联匹配的文件到html文件里
      inlineSource: '(runtime|inlinesource).+\\.(js|css)',
      favicon: './frontend/src/common/images/favicon.ico'
    }),
    new HTMLInlineSourcePlugin(),
    new MiniCssExtractPlugin({
      filename: utils.completeStaticPath('styles/[name].[contenthash].css'),
      chunkFilename: utils.completeStaticPath('styles/[name].[chunkhash].css')
    }),
    new StatsPlugin('stats.json'),
    // momentjs本地化语言包移除，只保留英文语言包
    new MomentLocalesPlugin()
  ],
  // 应用快照捕捉，开启后可以收集打包结果，包括提示、打包所需的时间、打包后文件和模块的分布等
  profile: true,
  // 细料度地控制打包时命令行窗口输出的信息和提示，详见https://webpack.js.org/configuration/stats/
  stats: {
    entrypoints: false,
    children: false
  }
});
