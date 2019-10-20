/**
 * 管理后台子路由
 */

import api from '@/api';

// 声明函数，主要用于动态引入模块，实现路由懒加载，以下为后台页面需要用到的模块的声明
// 关于路由懒加载, 详见： https://router.vuejs.org/guide/advanced/lazy-loading.html
const PostManage = () => import(/* webpackChunkName: "admin" */ 'components/Admin/PostManage');
const PostEdit = () => import(/* webpackChunkName: "admin" */ 'components/Admin/PostEdit');
const BlogInfo = () => import(/* webpackChunkName: "admin" */ 'components/Admin/BlogInfo');
const BlogInfoBaseInfo = () => import(/* webpackChunkName: "admin" */ 'components/Admin/BlogInfo/BaseInfo');
const BlogInfoBlogroll = () => import(/* webpackChunkName: "admin" */ 'components/Admin/BlogInfo/Blogroll');
const BlogInfoAbout = () => import(/* webpackChunkName: "admin" */ 'components/Admin/BlogInfo/About');
const Account = () => import(/* webpackChunkName: "admin" */ 'components/Admin/Account');
const AccountBaseInfo = () => import(/* webpackChunkName: "admin" */ 'components/Admin/Account/BaseInfo');
const AccountPassword = () => import(/* webpackChunkName: "admin" */ 'components/Admin/Account/Password');


export const routes = [
  {
    path: '',
    redirect: 'postmanage'
  },
  {
    path: 'postmanage',
    component: PostManage,
    meta: {
      // 组件是否缓存
      keepAlive: false,
      // 组件深度
      deepth: 1
    }
  },
  {
    path: 'bloginfo',
    component: BlogInfo,
    meta: {
      keepAlive: false,
      deepth: 1
    },
    children: [
      {
        path: '',
        redirect: 'baseinfo',
        meta: {
          keepAlive: false,
          deepth: 2
        }
      },
      {
        path: 'baseinfo',
        component: BlogInfoBaseInfo,
        meta: {
          keepAlive: false,
          deepth: 2
        }
      },
      {
        path: 'blogroll',
        component: BlogInfoBlogroll,
        meta: {
          keepAlive: false,
          deepth: 2
        }
      },
      {
        path: 'about',
        component: BlogInfoAbout,
        meta: {
          keepAlive: false,
          deepth: 2
        }
      }
    ]
  },
  {
    path: 'postedit',
    component: PostEdit,
    meta: {
      keepAlive: false,
      deepth: 2
    }
  },
  {
    path: 'postedit/:id',
    component: PostEdit,
    meta: {
      keepAlive: false,
      deepth: 2
    }
  },
  {
    path: 'account',
    component: Account,
    meta: {
      keepAlive: false,
      deepth: 1
    },
    children: [
      {
        path: '',
        redirect: 'baseinfo',
        meta: {
          keepAlive: false,
          deepth: 2
        }
      },
      {
        path: 'baseinfo',
        component: AccountBaseInfo,
        meta: {
          keepAlive: false,
          deepth: 2
        }
      },
      {
        path: 'password',
        component: AccountPassword,
        meta: {
          keepAlive: false,
          deepth: 2
        }
      }
    ]
  }
];