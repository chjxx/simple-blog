## 简介
- 一个简单、轻量的单页面博客系统
- **运行环境:**
  - **Nodejs: `v10.15.0`**
  - **MongoDB: `v3.6`**
- **技术栈:**
  - **前端**:
    - Vue (框架)
    - Vue Loader (路由)
    - Vuex (状态管理)
    - Axios (Ajax处理)
    - Webpack (打包)
    - Babel (ES6语法编译及打Polyfill)
    - Postcss (Scss语法编译及补全特定浏览器样式前缀)
  - **服务端**:
    - Express (框架)
    - MongoDB (数据库)
    - Mongoose (数据库操作)
    - bcrypt (加密)
    - selfsigned (ssl证书生成，只做测试用)
    - express-session (session管理)
    - formidable (上传表单数据处理)
    - compression (文件传输压缩)
- **兼容性:** 前端页面兼容**IE10**及以上


## 开始
- [布署项目环境及启动](https://github.com/chjxx/simple-blog/blob/master/docs/DEPLOYMENT.md)
- [项目树](https://github.com/chjxx/simple-blog/docs/TREE.md)

## Todo
  - [x] 上传头像压缩
  - [x] 图片懒加载
  - [x] 文章懒加载
  - [x] 页面按需加载
  - [x] gzip请求文件压缩
  - [ ] 非管理员账户注册
  - [ ] 第三方账号注册登陆
  - [ ] 评论功能
  - [ ] 图片管理
  - [ ] 音乐功能
  - [ ] 视频功能

---
**此博客只做学习交流用，安全性考虑有所欠缺，请勿用于实际场景**
