/**
 * 服务端接口主文件
 */

import axios from 'axios';
// 文章标签接口
import tags from './tags';
// 文章接口
import posts from './posts';
// 博客信息接口
import bloginfo from './bloginfo';
// 用户接口
import users from './users';
// 图片接口
import images from './images';
// 返回结果的状态
const [SUCCESS, ERROR] = [0, 1];

// request拦截器，在发送请求前做一些公共处理
axios.interceptors.request.use(config => {
  return config;
}, err => {
  return Promise.reject(err);
});

// response拦截器，在收到返回信息后做一些公共处理
axios.interceptors.response.use(res => {
  // 收到返回信息后，判断请求操作是成功还是有异常
  if (res.data.code === SUCCESS) {
    return Promise.resolve(res.data);
  } else if (res.data.code === ERROR) {
    return Promise.reject(res.data);
  }
}, err => {
  return Promise.reject(err);
});

let api = {
  tags,
  posts,
  bloginfo,
  users,
  images
};

export default api;