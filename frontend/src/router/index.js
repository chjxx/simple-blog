/**
 * 路由主文件
 */

import Vue from 'vue';
import Router from 'vue-router';
// 以Axios为基础的后端接口
import api from '@/api';
// 前台子路由
import { routes as appRoutes } from './app';
// 后台子路由
import { routes as adminRoutes} from './admin';

import loadingPage from '@/common/scripts/loadingPage';

// 声明函数，主要用于动态引入组件，实现路由懒加载，以下为各页面的主要组件的声明
// 关于路由懒加载, 详见： https://router.vuejs.org/guide/advanced/lazy-loading.html
const App = () => import(/* webpackChunkName: "app" */ 'components/App');
const Admin = () => import(/* webpackChunkName: "admin" */ 'components/Admin');
const Sign = () => import(/* webpackChunkName: "sign" */ 'components/Sign');
const ErrorPage = () => import(/* webpackChunkName: "errorpage" */ 'components/ErrorPage');

// 添加Vue Router插件
Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      // 前台
      path: '/',
      component: App,
      children: appRoutes,
      meta: {
        // 组件是否缓存
        keepAlive: false,
        // 组件深度
        deepth: 0
      }
    },
    {
      // 管理后台
      path: '/admin',
      component: Admin,
      meta: {
        keepAlive: false,
        deepth: 0
      },
      children: adminRoutes
    },
    {
      // 登陆页
      path: '/sign',
      component: Sign,
      meta: {
        keepAlive: false,
        deepth: 0
      }
    },
    {
      // 404页面, 匹配上面路由没有匹配到的路径
      path: '*',
      component: ErrorPage,
      meta: {
        keepAlive: false,
        deepth: 0
      }
    }
  ]
});

router.afterEach((to, from) => {
  // 如果加载页面显示则关闭
  loadingPage.hide();
  // 目标组件名
  let toComponentName = to.matched[to.matched.length - 1].components.default.name;
  // 设置浏览器窗口title
  window.document.title = toComponentName;
});

export default router;