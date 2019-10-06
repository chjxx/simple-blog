/**
 * 博客导航条组件
 */

<template>
  <nav class="m-nav" :class="stateClass">
    <!-- 导航条容器 -->
    <div class="ctnr" ref="navCtnr">
      <div class="wrap">
        <!-- 博客信息 -->
        <Bloginfo
          :normal-nav="isNormalNav"
          :blog-name="blogName"
          :logo-css-val="logoCSSVal"
        ></Bloginfo>
        <!-- 导航条模式切换按钮 -->
        <NavSwitch :normal-nav="isNormalNav" @normal-mode="switchToNormalNav"></NavSwitch>
        <!-- 路由菜单 -->
        <AppMenu class="nav-menu" :normal-nav="isNormalNav" :menu="menu" @click.native="resetNavState"></AppMenu>
        <!-- 外链 -->
        <Linkout :normal-nav="isNormalNav" :linkout="linkout"></Linkout>
      </div>
    </div>
    <!-- 博客设置 -->
    <div class="ctrl">
      <button class="theme u-btn2 icon" :class="nextTheme.icon" @click="switchToNextTheme"></button>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
// 滚动库
import BScroll from 'better-scroll';
import Bloginfo from 'components/common/NavComponents/Bloginfo';
import NavSwitch from 'components/common/NavComponents/NavSwitch';
import AppMenu from 'components/common/NavComponents/Menu';
import Linkout from 'components/common/NavComponents/Linkout';

export default {
  name: 'Nav',
  components: { Bloginfo, NavSwitch, AppMenu, Linkout },
  data() {
    return {
      //路由菜单数据
      menu: [
        { key: '1-home', title: '首页', link: '/', icon: 'iconposts' },
        { key: '1-archives', title: '归档', link: '/archives', icon: 'iconarchives' },
        { key: '1-tags', title: '标签', link: '/tags', icon: 'icontags' },
        { key: '1-about', title: '关于', link: '/about', icon: 'iconinfo' },
        { key: '1-blogroll', title: '友链', link: '/blogroll', icon: 'iconlink' },
        { key: '1-search', title: '搜索', link: '/search', icon: 'iconsearch' }
      ],
      linkout: [
        {
          name: 'github',
          site: 'https://github.com/chjxx',
          icon: 'icongit'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('blog', ['blogName', 'logoCSSVal', 'nextTheme']),
    ...mapGetters('app', ['isNormalNav']),
    stateClass() {
      return this.isNormalNav ? 'nav__normal' : 'nav__mini';
    }
  },
  methods: {
    ...mapMutations('app', ['switchToNormalNav']),
    ...mapMutations('blog', ['switchToNextTheme']),
    ...mapActions('app', ['resetNavState']),
    /**
     * 初始化滚动
     * @return {[type]}
     */
    _initScroll() {
      this._ctScroll = new BScroll(this.$refs.navCtnr, {
        click: true,
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      });
    }
  },
  mounted() {
    this._initScroll();
  }
};
</script>

<style lang="scss">
$sidebarNormalWidth: 200px;
$sidebarMiniWidth: 65px;
$themeButtonHeight: 50px;

.m-nav {
  $navBgColor: rgba(38, 50, 56, 1);
  position: relative;
  height: 100%;
  padding-bottom: $themeButtonHeight;
  background-color: $navBgColor;
  >.ctnr {
    height: 100%;
    >.wrap {
      $listColor: #bec4ca;
      position: relative;
      color: $listColor;
      .nav-menu {
        margin-top: 20px;
      }
    }
  }
  >.ctrl {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $themeButtonHeight;
    background-color: $navBgColor;
    box-shadow: 0 0 100rem rgba(255, 255, 255, .03) inset, 0 -1px 3px rgba(0, 0, 0, .3);
    .theme {
      width: 100%;
      line-height: $themeButtonHeight;
    }
  }
  .theme-dark & {
    background-color: #272727;
    .ctrl{
      background-color: #272727;
    }
  }
  @media screen and (min-width: 769px) {
    &.nav__mini {
      width: $sidebarMiniWidth;
    }
    &.nav__normal {
      width: $sidebarNormalWidth;
    }
  }
  @media screen and (max-width: 768px) {
    width: $sidebarNormalWidth;
    >.ctrl {
      display: none;
    }
  }
}
</style>
