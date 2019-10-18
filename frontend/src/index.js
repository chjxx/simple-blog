/**
 * 项目前端入口文件
 */

// 公共css引入
import './common/styles/index.scss';
import Vue from 'vue';
// 以Axios为基础的后端接口
import api from './api';
// 以VUEX为基础的store
import store from './store';
// 以Vue Router为基础的router
import router from './router';
// 基础组件批量注册，供全局使用
import './components/common/base/baseComponentRegister';
import './common/scripts/formdata-polyfill';

// 阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false;

// 将api存储到vue实例原型链, 使后代组件都能通过this.$api使用
Vue.prototype.$api = api;

/* eslint-disable no-new */
new Vue({
  el: '#base',
  store,
  router,
  // 创建一个router-view元素并返回，vue-router会根据访问地址填充相应的组件
  render: (h) => h('router-view')
});