/** * 博客管理后台主文件 */

<template>
  <div id="admin" :class="navStateClass">
    <!-- 导航栏 -->
    <div class="g-sd2"><AdminNav></AdminNav></div>
    <div class="g-mn2 f-scrollbar-decor" ref="scrollBox" @click="resetNavState">
      <div class="g-mn2-ctnr">
        <!-- 头部 -->
        <AdminHeader></AdminHeader>
        <!-- 主体 -->
        <keep-alive :include="keepAliveComponentNames">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <transition-group name="message-ctnr" tag="div" class="message-ctnr">
      <div
        v-for="message in messages"
        :key="message.key"
        :class="message.class"
      >
        {{ message.content }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import AdminNav from './Nav/index';
import AdminHeader from './Header';
import { forEachRight, capitalizeFirstLetter, throttle } from '@/common/scripts/utils';

export default {
  name: 'Admin',
  components: { AdminNav, AdminHeader },
  data() {
    return {
      // 缓存组件数组
      keepAliveComponents: [],
      scrollBoxListener: null
    };
  },
  computed: {
    ...mapState('admin', {
      navShow: 'navShow',
      messages: 'messages'
    }),
    /**
     * 导航条状态class，判断是否要显示导航条（移动端默认隐藏导航条）
     * @return {string}
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
    ...mapMutations('admin', [
      'setScrollBox',
      'addScrollBoxListener',
      'removeScrollBoxListener',
      'scrollTo',
      'scrollToTop'
    ]),
    ...mapActions('admin', ['resetNavState', 'notify']),
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
      let vm = this;
      // 如果当前路由有开启缓存，则在跳转路由之前保存滚动位置
      if (from.meta.keepAlive) {
        from.meta.lastScrollTop = this.$refs.scrollBox.scrollTop;
      }
      // 如果目标路由有开启缓存，则在下一次DOM更新之后滚动到之前保存的位置
      if (to.meta.keepAlive) {
        vm.$nextTick(() => {
          vm.scrollTo(to.meta.lastScrollTop);
        });
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
    }, 100);

    this.addScrollBoxListener(this.scrollBoxListener);
  },
  beforeDestroy() {
    this.removeScrollBoxListener(this.scrollBoxListener);
  }
};
</script>

<style lang="scss">
$headerHeight: 50px;
$sidebarWidth: 200px;
$sidebarMinWidth: 65px;

#admin {
  position: relative;
  height: 100%;
  .g-sd2 {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 10;
  }
  // 主体部分
  .g-mn2 {
    height: 100%;
    padding-left: $sidebarMinWidth;
    overflow: auto;
    // 主体部分减导航条部分
    .g-mn2-ctnr {
      position: relative;
      min-height: 100%;
      z-index: 1;
    }
    %pageMsg {
      position: absolute;
      left: $sidebarMinWidth;
      bottom: 0;
      width: calc(100% - 65px);
      padding: 15px 20px;
      color: #fff;
      line-height: 20px;
      font-size: 1.2rem;
      text-align: center;
      z-index: 2;
    }
    .pagemsg__success {
      @extend %pageMsg;
      background-color: rgba(0, 188, 212, 1);
    }
    .pagemsg__error {
      @extend %pageMsg;
      background-color: rgba(244, 67, 54, 1);
    }
    .popup-enter,
    .popup-leave-to {
      transform: translateY(100%);
    }
    .popup-enter-to,
    .popup-leave {
      transform: translateY(0);
    }

    .popup-enter-active,
    .popup-leave-active {
      transition: all 0.1s;
    }
  }
  .message-ctnr {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 280px;
    z-index: 20;
    .message__success,
    .message__error {
      margin-top: 5px;
      width: 100%;
      padding: 15px 20px;
      border-radius: 4px;
      font-size: 1.4rem;
      color: #fff;
    }
    .message__success {
      background-color: rgba(0, 188, 212, 0.6);
    }
    .message__error {
      background-color: rgba(244, 67, 54, 0.7);
    }
    .message-ctnr-enter {
      transform: translate3d(200%, 0, 0);
    }
    .message-ctnr-leave-to {
      opacity: 0;
    }
    .message-ctnr-enter-active {
      transition: all 0.3s;
    }
    .message-ctnr-leave-active {
      transition: all 0.6s;
    }
  }
}

// 隐藏左部导航条，显示主体头部Header
@media screen and (max-width: 768px) {
  #admin {
    .g-sd2 {
      transform: translate3d(-100%, 0, 0);
    }
    .g-mn2 {
      padding: 0;
      .g-mn2-ctnr {
        padding-top: $headerHeight;
      }
    }
    .message-ctnr {
      bottom: 100px;
      right: 15px;
    }
    &.nav__show {
      transform: translate3d($sidebarWidth, 0, 0);
    }
  }
}
</style>
