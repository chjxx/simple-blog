/**
 * 博客主文件
 */

<template>
  <div id="app" :class="navStateClass">
    <!-- 导航栏 -->
    <div class="g-sd1"><AppNav></AppNav></div>
    <!-- 主要内容区 -->
    <div class="g-mn1 f-scrollbar-decor" ref="scrollBox" @click="resetNavState">
      <!-- 主要内容 -->
      <div class="g-mn1-ctnr">
        <!-- 头部 -->
        <AppHeader></AppHeader>
        <!-- 主体 -->
        <keep-alive :include="keepAliveComponentNames">
          <router-view></router-view>
        </keep-alive>
        <!-- 底部 -->
        <AppFooter></AppFooter>
      </div>
      <transition name="scale">
        <!-- 返回顶部按钮 -->
        <div
          v-show="scrollToTopBtnShow"
          class="btn-to-top icon icontotop"
          @click="scrollToTop"
        ></div>
      </transition>
    </div>
    <div class="test"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import AppNav from './Nav';
import AppHeader from './Header';
import AppFooter from './Footer';
import { forEachRight, capitalizeFirstLetter, throttle } from '@/common/scripts/utils';

export default {
  name: 'App',
  components: { AppNav, AppHeader, AppFooter },
  data() {
    return {
      // 缓存组件数组
      keepAliveComponents: [],
      // 返回顶部按钮显示
      scrollToTopBtnShow: false,
      scrollBoxListener: null
    };
  },
  computed: {
    ...mapState('app', ['navShow']),
    /**
     * 导航条状态class，判断是否要显示导航条（移动端默认隐藏导航条）
     * @return {string} class
     */
    navStateClass() {
      return this.navShow ? 'nav__show' : '';
    },
    /**
     * 缓存组件的名称数组
     * @return {Array}
     */
    keepAliveComponentNames() {
      return this.keepAliveComponents.map(component => {
        return component.name;
      });
    }
  },
  methods: {
    ...mapMutations('app', [
      'setScrollBox',
      'addScrollBoxListener',
      'removeScrollBoxListener',
      'scrollTo',
      'scrollToTop'
    ]),
    ...mapActions('app', ['resetNavState']),
    /**
     * 更新缓存数组
     * @param  {Object} to 目标路由
     * @param  {Object} from 当前路由
     */
    updateKeepAliveComponents(to, from) {
      // 目标组件名
      let toComponentName =
        to.matched[to.matched.length - 1].components.default.name;
      // 目标路由深度
      let toRouteDeepth = to.meta.deepth;
      // 目标路由缓存状态
      let toRouteKeepAlive = to.meta.keepAlive;

      // 删除过期的缓存组件，如果某组件与目标组件名称不同并且该组件深度大于或等于目标组件，则视为过期组件
      forEachRight(this.keepAliveComponents, (component, index, components) => {
        if (
          component.name !== toComponentName &&
          component.routeDeepth >= toRouteDeepth
        ) {
          components.splice(index, 1);
        }
      });

      // 判断是否需要缓存目标组件, 如果目标路由缓存状态开启并且缓存数组中还未有该组件，则添加
      if (
        toRouteKeepAlive &&
        !this.keepAliveComponentNames.includes(toComponentName)
      ) {
        this.pushKeepAliveComponent(to);
      }
    },
    /**
     * 更新窗口滚动位置
     * @param  {Object} to 目标路由
     * @param  {Object} from 当前路由
     */
    updateScrollTop(to, from) {
      // 如果当前路由有开启缓存，则在跳转路由之前保存滚动位置
      if (from.meta.keepAlive) {
        from.meta.lastScrollTop = this.$refs.scrollBox.scrollTop;
      }
      // 如果目标路由有开启缓存，则在下一次DOM更新之后滚动到之前保存的位置
      if (to.meta.keepAlive) {
        this.$nextTick(() => {
          this.scrollTo(to.meta.lastScrollTop);
        });
      } else {
        this.$refs.scrollBox.scrollTop = 0;
      }
    },
    /**
     * 添加路由到缓存数组
     * @param  {Object} route 路由对象
     */
    pushKeepAliveComponent(route) {
      // 目标组件名
      let componentName =
        route.matched[route.matched.length - 1].components.default.name;
      // 收集与要缓存的组件相关的属性
      let component = Object.keys(route.meta).reduce(
        (component, key) => {
          // 路由meta属性中的key，对目标路由meta属性中的key首字母大写化，并添加'route'前缀
          let componentKey = 'route' + capitalizeFirstLetter(key);

          component[componentKey] = route.meta[key];

          return component;
        },
        {
          name: componentName
        }
      );

      this.keepAliveComponents.push(component);
    }
  },
  watch: {
    $route(to, from) {
      this.updateKeepAliveComponents(to, from);
      this.updateScrollTop(to, from);
    }
  },
  created() {
    // 手动判断是否添加当前路由，初始化时$route还未改变，监听不到
    if (this.$route.meta.keepAlive) {
      this.pushKeepAliveComponent(this.$route);
    }
  },
  mounted() {
    this.setScrollBox(this.$refs.scrollBox);

    this.scrollBoxListener = throttle(e => {
      if (e.target.scrollTop >= window.innerHeight / 2) {
        this.scrollToTopBtnShow = true;
      } else {
        this.scrollToTopBtnShow = false;
      }
    });

    this.addScrollBoxListener(this.scrollBoxListener);
  },
  beforeDestroy() {
    this.removeScrollBoxListener(this.scrollBoxListener);
  }
};
</script>

<style lang="scss">
$headerHeight: 50px;
$footerHeight: 80px;
$footerMobHeight: 70px;
$sidebarWidth: 200px;
$sidebarMinWidth: 65px;

#app {
  position: relative;
  height: 100%;
  width: 100%;
  .g-sd1 {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
  }
  .g-mn1 {
    position: relative;
    height: 100%;
    width: 100%;
    padding-left: $sidebarMinWidth;
    overflow: auto;
    .g-mn1-ctnr {
      position: relative;
      min-height: 100%;
      padding-bottom: $footerHeight;
      .ctss, .ctss1 {
        height: 700px;
      }
      .ctss {
        background-color: red;
      }
      .ctss1 {
        background-color: blue;
      }
    }
    .btn-to-top {
      position: fixed;
      bottom: 50px;
      right: 50px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      line-height: 40px;
      text-align: center;
      background-color: rgb(33, 150, 243);
      color: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      overflow: hidden;
    }
    .scale-enter-active,
    .scale-leave-active {
      transition: all 0.1s linear;
    }
    .scale-enter,
    .scale-leave-to {
      transform: scale(0.2);
    }
  }
  .theme-dark & {
    .g-mn1 {
      .btn-to-top {
        background-color: #0b63aa;
      }
    }
  }
}

// 隐藏左部导航条，显示主体头部Header
@media screen and (max-width: 768px) {
  #app {
    .g-sd1 {
      transform: translate3d(-100%, 0, 0);
    }
    .g-mn1 {
      padding: 0;
      .g-mn1-ctnr {
        padding-top: $headerHeight;
        padding-bottom: $footerMobHeight;
      }
      .btn-to-top {
        bottom: 30px;
        right: 20px;
      }
    }
    &.nav__show {
      transform: translate3d($sidebarWidth, 0, 0);
    }
  }
}
</style>
