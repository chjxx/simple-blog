- [环境搭建](#环境搭建)
- [仓库及第三方库安装](#仓库及第三方库安装)
  - [克隆到本地电脑](#克隆到本地电脑)
  - [安装项目依赖](#安装项目依赖)
  - [配置数据库地址](#配置数据库地址)
- [以开发模式启动](#以开发模式启动)
- [以生产模式启动](#以生产模式启动)
- [分析前端静态文件](#分析前端静态文件)

## 环境搭建
> 参考[N-blog](https://github.com/nswbmw/N-blog)博客中的环境搭建。(PS: 该项目是一个很好的学习项目)

> 或者直接官方文档: [MongoDB](https://docs.mongodb.com/v3.6/installation/)

## 仓库及第三方库安装

1. #### 克隆到本地电脑
    ```
    // 假设为window环境，存放位置为E盘的根目录

    E:\> git clone git@github.com:chjxx/simple-blog.git
    ```
    > 如果git未安装: 请到这里[安装 Git](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)下载安装
2. #### 安装项目依赖
    ```
    // 进入项目目录
    E:\> cd simple-blog
    // 安装项目依赖
    E:\simple-blog\> npm install
    ```

    在安装过程可能会**报错**，可能是安装node-sass或者bcrypt这两个库引起的，解决方法是先单独安装这两个库:

    - **安装node-sass**

    ```
    E:\simple-blog\> npm i node-sass -D
    ```

    - **安装bcrypt**

    ```
    E:\simple-blog\> npm i bcrypt -S
    ```
    - **之后再安装其他库**

    ```
    E:\simple-blog\> npm install
    ```

3. #### 配置数据库地址

     **默认你已经安装好了MongoDB并启动了**

     在项目的./src/config/index.js的文件中配置MongoDB服务器地址（默认为: mongodb://localhost:27017/blog）

    ```
    ./src/config/index.js


    // 数据库地址
    mongodb: 'mongodb://localhost:27017/blog'
    ```

    **以上完成之后我们的环境以及包全部的下载安装搭建完毕，接下来开启项目**

## 以开发模式启动
- **启动服务器:** 在cmd中项目根目录下输入：

    ```
    E:\simple-blog\> npm run dev
    ```
- 此模式你可以根据需求**修改前端项目页面**（前端项目入口：./frontend），页面将**自动更新**

## 以生产模式启动
- **打包前端静态文件**，在cmd中项目根目录下输入：

    ```
    E:\simple-blog\> npm run build
    ```

- **启动服务器**，在cmd中项目根目录下输入：

    ```
    E:\simple-blog\> npm start
    ```
- 此模式中前端项目经过**优化**，页面加载速度达到**最佳**

## 分析前端静态文件
- **打包前端静态文件**，在cmd中项目根目录下输入：

    ```
    E:\simple-blog\> npm run build
    ```

- **启动webpack-bundle-analyzer**，在cmd中项目根目录下输入：

    ```
    E:\simple-blog\> npm run analyzer
    ```
- 此模式能够分析前端项目包含的东西**视觉化**，让你更直观的了解前端项目的情况，适当做出**优化调整**
