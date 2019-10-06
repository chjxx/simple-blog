const config = require('../../config');
const mongoose = require('mongoose');
const UserModel = require('./user');
const PostModel = require('./post');
const BlogInfoModel = require('./bloginfo');
const ImageModel = require('./image');
const { mongooseLogger } = require('../loggers');

// mongoose建立连接时的监听函数
mongoose.connection.on('connecting', () => {
  mongooseLogger.info('Connecting to the MongoDB server...');
});
// mongoose连接成功时的监听函数
mongoose.connection.on('connected', () => {
  mongooseLogger.info('Successfully connected to the MongoDB server!');
});
// mongoose连接断开时的监听函数
mongoose.connection.on('disconnected', () => {
  mongooseLogger.warn('Disconnected from the MongoDB server！');
});
// mongoose连接错误时的监听函数
mongoose.connection.on('error', (e) => {
  mongooseLogger.error(e.message);
});

// 连接MongoDB
mongoose.connect(config.mongodb, { useNewUrlParser: true, useCreateIndex: true });

// 初始化 Model
exports.User = UserModel;
exports.Post = PostModel;
exports.Bloginfo = BlogInfoModel;
exports.Image = ImageModel;