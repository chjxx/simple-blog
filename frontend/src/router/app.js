/**
 * 前台子路由
 */

// 声明函数，主要用于动态引入模块，实现路由懒加载，以下为前台页面需要用到的模块的声明
// 关于路由懒加载, 详见： https://router.vuejs.org/guide/advanced/lazy-loading.html
const Posts = () => import(/* webpackChunkName: "app" */ 'components/App/Posts');
const Archives = () => import(/* webpackChunkName: "app" */ 'components/App/Archives')
const Tags = () => import(/* webpackChunkName: "app" */ 'components/App/Tags');
const About = () => import(/* webpackChunkName: "app" */ 'components/App/About');
const Blogroll = () => import(/* webpackChunkName: "app" */ 'components/App/Blogroll');
const Post = () => import(/* webpackChunkName: "app" */ 'components/App/Post');
const Search = () => import(/* webpackChunkName: "app" */ 'components/App/Search');


export const routes = [
  {
    path: '',
    component: Posts,
    meta: {
      // 组件是否缓存
      keepAlive: true,
      // 组件深度
      deepth: 1,
      // 路由器最近一次滚动的位置
      lastScrollTop: 0
    }
  },
  {
    path: 'posts',
    redirect: '/'
  },
  {
    path: 'archives',
    component: Archives,
    meta: {
      keepAlive: true,
      deepth: 1,
      lastScrollTop: 0
    }
  },
  {
    path: 'tags',
    component: Tags,
    meta: {
      keepAlive: true,
      deepth: 1,
      lastScrollTop: 0
    }
  },
  {
    path: 'about',
    component: About,
    meta: {
      keepAlive: false,
      deepth: 1
    }
  },
  {
    path: 'blogroll',
    component: Blogroll,
    meta: {
      keepAlive: false,
      deepth: 1
    }
  },
  {
    path: 'search',
    component: Search,
    meta: {
      keepAlive: true,
      deepth: 1,
      lastScrollTop: 0
    }
  },
  {
    path: 'posts/:id',
    component: Post,
    meta: {
      keepAlive: false,
      deepth: 2
    }
  }
];