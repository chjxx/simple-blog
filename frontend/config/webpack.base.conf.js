/**
 * webpack基础配置文件
 */

// vue-loader插件, 主要用于将其他rule应用到单文件组件中的对应代码块(template、script、style等)，比如'.js' rule应用到单文件组件中的script代码块
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 删除目录插件, 主要用于删除上一次编译的文件及目录
const CleanPlugin = require('clean-webpack-plugin');
const config = require('./config');
const utils = require('./utils');

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  // 项目基础路径, entry和loader等确定文件位置的依据
  context: utils.ROOTPATH,
  output: {
    path: utils.resolve('./www'),
    publicPath: config[NODE_ENV].outputPublicPath,
    filename: utils.completeStaticPath(config[NODE_ENV].outputFilename),
    chunkFilename: utils.completeStaticPath(config[NODE_ENV].outputChunkFilename)
  },
  resolve: {
    // 文件后缀属性，主要用于import文件时自动补全后缀
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': utils.resolve('./frontend/src'),
      common: utils.resolve('./frontend/src/common'),
      components: utils.resolve('./frontend/src/components')
    }
  },
  devtool: config[NODE_ENV].devtool,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: utils.completeStaticPath('images/[name][hash].[ext]')
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: utils.completeStaticPath('media/[name][hash].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8000,
          name: utils.completeStaticPath('fonts/[name][hash].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CleanPlugin(utils.resolve('./www'), { root: utils.ROOTPATH }),
    new VueLoaderPlugin()
  ]
};
