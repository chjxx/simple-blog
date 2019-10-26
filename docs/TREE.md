- [项目目录](#项目目录)
- [前端项目目录](#前端项目目录)
- [后端项目目录](#后端项目目录)


- ## 项目目录
  ```
  ├─ docs ------------------------------------------------ 文档目录
  ├─ frontend ----------------------------------------- 前端项目目录
  ├─ src ---------------------------------------------- 后端项目目录
  ├─ .babelrc ------------------------------------------- babel配置
  ├─ .eslintrc.js -------------------------------------- eslint配置
  ├─ .gitignore ------------------------------ 仓库忽略提交文件夹列表
  ├─ README.md ------------------------------------------- 仓库说明
  ├─ package-lock.json --------------------- 项目依赖库版本号锁定列表
  └─ package.json -------------------------- 项目信息及项目依赖库列表
  ```

- ## 前端项目目录
```
├─ config
│  ├─ config.js -------------------------- 供以下几个配置表使用的配置
│  ├─ utils.js --------------------------- 供以下几个配置表使用的函数
│  ├─ webpack.base.conf.js ------------------------ webpack基础配置
│  ├─ webpack.dev.conf.js ---------------------- webpack开发模式配置
│  └─ webpack.prod.conf.js --------------------- webpack生产模式配置
├─ src
│  ├─ api ----------------------------------------=------ 服务端api
│  │  ├─ bloginfo.js ---------------------------------- 博客信息api
│  │  ├─ images.js ------------------------------------ 图片资源api
│  │  ├─ index.js ------------------------------------- api入口文件
│  │  ├─ posts.js ------------------------------------- 文章数据api
│  │  ├─ tags.js ---------------------------------- 文章标签数据api
│  │  └─ users.js ---------------------------------------- 账户api
│  ├─ common --------------------------------------------- 公共文件
│  │  ├─ images ------------------------------------------ 公共图片
│  │  ├─ scripts ----------------------------------- 公共javascript
│  │  └─ styles ------------------------------------------- 公共css
│  ├─ components ------------------------------------------ vue组件
│  │  ├─ Admin ------------------------------------------- 后台页面
│  │  │  ├─ Account ------------------------------- 账户信息修改组件
│  │  │  ├─ BlogInfo ------------------------------ 博客信息修改组件
│  │  │  ├─ Header ------------------------------------ 页面头部组件
│  │  │  ├─ Nav ------------------------------------- 页面导航栏组件
│  │  │  ├─ PostEdit ----------------------------- 文章编辑/创建组件
│  │  │  ├─ PostManage -------------------------------- 文章管理组件
│  │  │  └─ index.vue ------------------------------- 后台页面主组件
│  │  ├─ App --------------------------------------------- 前台页面
│  │  │  ├─ About ------------------------------------- 博客说明组件
│  │  │  ├─ Archives ---------------------------------- 文章档案组件
│  │  │  ├─ Blogroll ------------------------------------- 友链组件
│  │  │  ├─ Footer ------------------------------------ 页面底部组件
│  │  │  ├─ Header ------------------------------------ 页面头部组件
│  │  │  ├─ Nav ------------------------------------- 页面导航栏组件
│  │  │  ├─ Post ----------------------------------------- 文章组件
│  │  │  ├─ Posts ----------------------------------- 文章列表页组件
│  │  │  ├─ Search ------------------------------------ 文章搜索组件
│  │  │  ├─ Tags -------------------------------------- 文章标签组件
│  │  │  └─ index.vue ------------------------------- 前台页面主组件
│  │  ├─ ErrorPage ---------------------------------------- 404页面
│  │  ├─ Sign ---------------------------------------- 登陆/注册页面
│  │  │  ├─ SignIn --------------------------------------- 登陆组件
│  │  │  ├─ SignUp --------------------------------------- 注册组件
│  │  │  └─ index.vue -------------------------- 登陆/注册页面主组件
│  │  └─ common ------------------------------------------ 公共组件
│  │     ├─ DataTable -------------------------------- 数据表格组件
│  │     ├─ Markdown --------------------------- Markdown编辑器组件
│  │     ├─ NavComponents ------------------------- 页面导航栏子组件
│  │     ├─ PostList --------------------------------- 文章列表组件
│  │     └─ base -------------------- 基础元件组件，如按钮、状态栏等
│  ├─ router --------------------------------------------- 路由文件
│  │  ├─ admin.js ------------------------------------ 后台页面路由
│  │  ├─ app.js -------------------------------------- 前台页面路由
│  │  └─ index.js -------------------------------------- 路由主文件
│  ├─ store -------------------------------------- vuex状态管理模块
│  │  ├─ modules ----------------------------------------- 状态模块
│  │  │  ├─ admin.js --------------------------------- 后台页面状态
│  │  │  ├─ app.js ----------------------------------- 前端页面状态
│  │  │  └─ blog.js ---------------------------------- 博客信息状态
│  │  └─ index.js ---------------------------------- 状态管理主文件
│  └─ index.js ----------------------------------- 前端项目入口文件
└─ index.html ------------------------------------ 前端页面html文件
```

- ## 后端项目目录
```
├─ config -------------------------------------------- 配置文件目录
│  ├─ file.js ------------------------------------ 文件处理模块配置
│  └─ index.js ------------------------------------------ 项目配置
├─ kits -------------------------- 配置元件库，主要服务于项目入口文件
│  ├─ assets.js -------------------------------- 配置资源文件中间件
│  ├─ compression.js ------------------------ 配置传输信息压缩中间件
│  ├─ errorLogger.js ------------------------ 配置错误日志处理中间件
│  ├─ form.js ------------------------------- 配置表单上传处理中间件
│  ├─ logger.js ----------------------------- 配置请求日志处理中间件
│  ├─ preset.js --- 加工请求变量中间件，初始化属性等以便之后中间件处理
│  ├─ server.js -------------------------- 配置服务器(server)并启动
│  ├─ session.js ---------------------------- 配置session处理中间件
│  └─ wwwStatic.js -------------------------- 配置静态文件处理中间件
├─ lib ------------------------------------ 公共库，放一些公用的模块
│  ├─ file ------------------------------------------- 文件处理模块
│  │  ├─ path ------------------------------------ 文件路径处理模块
│  │  │  ├─ resolve.js --------- 将数据库数据中的文件属性加上公开路径
│  │  │  └─ simplify.js --- 将客户端提交的数据中的文件属性去年公开路径
│  │  ├─ del.js -------------------------------------- 删除文件模块
│  │  └─ index.js ------------------------------ 文件处理模块主文件
│  ├─ mongo --------- Mongoose模块，主要是定义一些model以及连接数据库
│  │  ├─ bloginfo.js ------------------------------- 博客信息model
│  │  ├─ image.js -------------------------------------- 图片model
│  │  ├─ index.js ------------------------------ Mongoose模块主文件
│  │  ├─ post.js --------------------------------------- 文章model
│  │  └─ user.js --------------------------------------- 账户model
│  ├─ ExtendError.js --------------------------------- Error扩展类
│  ├─ loggers.js ------------------------------------- 日志传输模块
│  └─ utils.js ----------------------------------------- 公共方法库
├─ middlewares -------------------------------- 中间件库，服务于路由
│  ├─ check.js --------------------------------------- 检查中间件库
│  ├─ del.js ----------------------------------------- 删除中间件库
│  ├─ index.js ------------------------------------- 中间件库主文件
│  ├─ intercept.js ----------------------------------- 拦截中间件库
│  ├─ organize.js -------------------------------- 数据组织中间件库
│  └─ posts.js --------------------------------------- 文章中间件库
├─ models ------------------------------------------ 数据库操作模块
│  ├─ bloginfo ------------------------------------- 博客信息方法库
│  │  ├─ errorHandler.js ------------------ 操作过程中报错的处理模块
│  │  ├─ index.js ----------------------------- 博客信息方法库主文件
│  │  ├─ mongoModelFn.js ------------------------- 方法(访问数据库)
│  │  └─ plugins.js ---------------------------- 插件(不访问数据库)
│  ├─ image ---------------------------------------- 图片资源方法库
│  │  ├─ errorHandler.js ------------------ 操作过程中报错的处理模块
│  │  ├─ index.js ----------------------------- 图片资源方法库主文件
│  │  ├─ mongoModelFn.js ------------------------- 方法(访问数据库)
│  │  └─ plugins.js ---------------------------- 插件(不访问数据库)
│  ├─ post ----------------------------------------- 文章资源方法库
│  │  ├─ errorHandler.js ------------------ 操作过程中报错的处理模块
│  │  ├─ index.js ----------------------------- 文章资源方法库主文件
│  │  ├─ mongoModelFn.js ------------------------- 方法(访问数据库)
│  │  └─ plugins.js ---------------------------- 插件(不访问数据库)
│  ├─ user -------------------------------------------- 账户方法库
│  │  ├─ errorHandler.js ----------------- 操作过程中报错的处理模块
│  │  ├─ index.js -------------------------------- 账户方法库主文件
│  │  ├─ mongoModelFn.js ------------------------- 方法(访问数据库)
│  │  └─ plugins.js ---------------------------- 插件(不访问数据库)
│  └─ index.js ------------------------------- 数据库操作模块主文件
├─ routes ----------------------------------------------- 路由模块
│  ├─ api --------------------------------------- 数据访问/处理路由
│  │  ├─ account.js ------------------------------------- 账户路由
│  │  ├─ bloginfo.js -------------------------------- 博客信息路由
│  │  ├─ images.js ---------------------------------- 图片资源路由
│  │  ├─ index.js ------------------------- 数据访问/处理路由主文件
│  │  ├─ posts.js ----------------------------------- 文章资源路由
│  │  ├─ signin.js -------------------------------------- 登陆路由
│  │  ├─ signout.js ------------------------------------- 登出路由
│  │  ├─ signup.js -------------------------------------- 注册路由
│  │  └─ tags.js ------------------------------------ 文章标签路由
│  ├─ error.js -------------------------------------- 错误处理路由
│  ├─ index.js ------------------------------------- 路由模块主文件
│  ├─ other.js -- 备选路由(如果之前的路由没有处理该请求，此路径将处理)
│  └─ static.js ------------------------------------- 静态文件路由
└─ index.js --------------------------------------- 项目主入口文件
```