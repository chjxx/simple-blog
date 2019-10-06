/**
 * store主文件
 */

import Vue from 'vue';
import Vuex from 'vuex';

import blog from './modules/blog';
import app from './modules/app';
import admin from './modules/admin';

// 注册插件
Vue.use(Vuex);

let store = new Vuex.Store({
  modules: {
    blog,
    app,
    admin
  },
  // 每次对state的修改都必须通过commit方式修改，否则会报错。 由于开销太大，在生产模式下将其关闭
  strict: process.env.NODE_ENV !== 'prodution'
});

// 初始化操作，获取博客基础信息
store.dispatch('blog/fetchInfo');

export default store;