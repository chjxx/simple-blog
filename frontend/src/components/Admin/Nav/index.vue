/**
 * 博客管理后台导航条组件
 */

<template>
  <div class="m-nav" :class="stateClass">
    <div class="ctnr" ref="navCtnr">
      <div class="ct">
        <!-- 博客信息 -->
        <Bloginfo
          :normal-nav="isNormalNav"
          :blog-name="blogName"
          :logo-css-val="logoCSSVal"
        ></Bloginfo>
        <!-- 导航条模式切换按钮 -->
        <NavSwitch :normal-nav="isNormalNav" @normal-mode="switchToNormalNav"></NavSwitch>
        <!-- 路由菜单 -->
        <Menu
          class="nav-menu"
          :normal-nav="isNormalNav"
          :menu="menu"
          @click.native="resetNavState"
        ></Menu>
      </div>
    </div>
    <div class="ctrl">
      <button class="btn-theme u-btn2 icon" :class="nextTheme.icon" @click="switchToNextTheme"></button>
      <button class="btn-signout u-btn2 icon iconsignout" @click="signOut"></button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import BScroll from 'better-scroll';
import Bloginfo from 'components/common/NavComponents/Bloginfo';
import NavSwitch from 'components/common/NavComponents/NavSwitch';
import Menu from 'components/common/NavComponents/Menu';
import loadingPage from 'common/scripts/loadingPage';

export default {
  name: 'Nav',
  components: { Bloginfo, NavSwitch, Menu },
  data() {
    return {
      // 路由菜单数据
      menu: [
        {
          key: '1-post',
          title: '文章管理',
          link: '/admin/postmanage',
          icon: 'iconpostmanage'
        },
        {
          key: '1-bloginfo',
          title: '网站信息',
          link: '/admin/bloginfo',
          icon: 'iconblogsetting',
          children: [
            {
              key: '2-bloginfo-base',
              title: '基础信息',
              link: '/admin/bloginfo/baseinfo'
            },
            {
              key: '2-bloginfo-blogroll',
              title: '友情链接',
              link: '/admin/bloginfo/blogroll'
            },
            {
              key: '2-bloginfo-about',
              title: '博客说明',
              link: '/admin/bloginfo/about'
            }
          ]
        },
        {
          key: '1-account',
          title: '账户信息',
          link: '/admin/account',
          icon: 'iconusersetting',
          children: [
            {
              key: '2-account-base',
              title: '基础信息',
              link: '/admin/account/baseinfo'
            },
            {
              key: '2-account-contacts',
              title: '账号密码',
              link: '/admin/account/password'
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapGetters('blog', ['blogName', 'logoCSSVal', 'nextTheme']),
    ...mapGetters('admin', ['isNormalNav']),
    stateClass() {
      return this.isNormalNav ? 'nav__normal' : 'nav__mini';
    }
  },
  methods: {
    ...mapMutations('admin', ['switchToNormalNav']),
    ...mapMutations('blog', ['switchToNextTheme']),
    ...mapActions('admin', ['resetNavState']),
    /**
     * 初始化滚动
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
    },
    /**
     * 退出登陆
     */
    signOut() {
      this.$api.users.signOut().then(resData => {
        loadingPage.show();

        return this.$router.push({ path: '/sign' });
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
$ctrlBtnHeight: 50px;
$ctrlBarHeight: $ctrlBtnHeight * 2;

.m-nav {
  $navBgColor: rgba(38, 50, 56, 1);
  position: relative;
  height: 100%;
  padding-bottom: $ctrlBarHeight;
  background-color: $navBgColor;
  >.ctnr {
    height: 100%;
    >.ct {
      $listColor: #bec4ca;
      $listHoverColor: #edeff1;
      $listBgColor: $navBgColor;
      $listHoverBgColor: rgba(27, 35, 39, 1);
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
    height: $ctrlBarHeight;
    background-color: $navBgColor;
    box-shadow: 0 0 100rem rgba(255, 255, 255, .03) inset, 0 -1px 3px rgba(0, 0, 0, .3);
    button {
      width: 100%;
      line-height: $ctrlBtnHeight;
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
      height: $ctrlBtnHeight;
      .btn-theme{
        display: none;
      }
    }
  }
}
</style>
