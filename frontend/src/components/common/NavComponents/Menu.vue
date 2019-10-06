/**
 * 导航菜单组件（供导航条用）
 */

<template>
  <!-- 列表 -->
  <ul :class="menuStateClass">
    <li
      v-for="FLItem in menu"
      :key="FLItem.key"
      :class="getItemClass(FLItem)"
      @mouseenter="showSubMenu(FLItem);"
      @mouseleave="hideSubMenu"
    >
      <router-link
        tag="a"
        :key="FLItem.key"
        :to="FLItem.link"
        :exact="FLItem.link === '/'"
      >
        <i class="icon" :class="FLItem.icon"></i>
        <span class="title">{{ FLItem.title }}</span>
        <i
          class="icon iconarrowright"
          :class="getSubMenuStateIconClass(FLItem.key)"
          v-if="FLItem.children"
          @click.stop.prevent="toggleSubMenu(FLItem)"
        ></i>
      </router-link>
      <!-- 子列表 -->
      <ul class="smenu" v-if="FLItem.children" v-show="isExtendedItemKey(FLItem.key)">
        <li v-for="SLItem in FLItem.children" :key="SLItem.key">
          <router-link
            tag="a"
            :to="SLItem.link"
            @click.native="hideSubMenu"
          >
            <span class="title">{{ SLItem.title }}</span>
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>

export default {
  name: 'Menu',
  data() {
    return {
      // 展开了子列表项的列表项key(key和id一样，只是为了区分和识别列表项)
      extendedItemKey: ''
    };
  },
  props: {
    normalNav: {
      type: Boolean
    },
    menu: {
      type: Array
    }
  },
  computed: {
    /**
     * 列表的状态class
     * @return {string}
     */
    menuStateClass() {
      return this.normalNav ? 'menu__normal' : 'menu__mini';
    }
  },
  watch: {
    /**
     * 如果Nav切换到Normal模式，则关闭扩展列表
     * @param  {Boolean} yes
     */
    normalNav(yes) {
      if (!yes) {
        this.resetExtendedItemKey();
      }
    }
  },
  methods: {
    /**
     * 获取列表项class
     * @param  {Object} item
     * @return {string}
     */
    getItemClass(item) {
      return item.children ? 'item-parent' : 'item';
    },
    /**
     * 获取子列表状态的图标class
     * @param  {string} key
     * @return {string}
     */
    getSubMenuStateIconClass(key) {
      return this.extendedItemKey === key ? 'sub__show' : 'sub';
    },
    /**
     * 是否为扩展列表项的key
     * @param  {string}  key
     * @return {Boolean}
     */
    isExtendedItemKey(key) {
      return this.extendedItemKey === key;
    },
    /**
     * 切换扩展列表的状态
     * @param  {Object} item
     */
    toggleSubMenu(item) {
      this.isExtendedItemKey(item.key) ? this.resetExtendedItemKey() : this.setExtendedItemKey(item.key);
    },
    /**
     * 在Nav为MINI模式下，鼠标移动到有子列表的列表项时，显示扩展的子列表
     * @param  {Object} item 列表项
     * @return {[type]}
     */
    showSubMenu(item) {
      // 如果不为NORMAL模式即为MINI模式
      if (!this.normalNav) {
        // 如果有子列表
        if (item.children) {
          // 显示子列表
          this.setExtendedItemKey(item.key);
        }
      }
    },
    /**
     * 关闭子列表
     */
    hideSubMenu() {
      if (!this.normalNav) this.resetExtendedItemKey();
    },
    /**
     * 重置扩展列表项的key
     */
    resetExtendedItemKey() {
      this.extendedItemKey = '';
    },
    /**
     * 设置扩展列表项的key
     */
    setExtendedItemKey(key) {
      this.extendedItemKey = key;
    }
  }
};
</script>

<style lang="scss">
$sidebarMiniWidth: 65px;
$routeIconWidth: 25px;
$routePaddingWidth: ($sidebarMiniWidth - $routeIconWidth) / 2;

$FLBG_Color: rgba(38, 50, 56, 1);
$FLBG_Active_Color: rgba(0, 0, 0, .2);
$SLBG_Color: $FLBG_Active_Color;
$SLBG_Active_Color: rgba(0, 0, 0, .2);

$FL_Color: rgba(255, 255, 255, 0.7);
$FL_Active_Color: rgba(255, 255, 255, 0.95);
$SL_Color: $FL_Color;
$SL_Active_Color: $FL_Active_Color;

.menu__normal,
.menu__mini {
  $liLineHeight: 46px;
  background-color: $FLBG_Color;
  width: 100%;
  > li {
    position: relative;
    background-color: $FLBG_Color;
    > a {
      position: relative;
      display: block;
      padding: 0 $routePaddingWidth;
      font-size: 1.4rem;
      color: $FL_Color;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
      >.icon {
        margin-right: 10px;
        display: inline-block;
        width: $routeIconWidth;
        height: $liLineHeight;
        font-size: 1.8rem;
        line-height: $liLineHeight;
        text-align: center;
        vertical-align: top;
      }
      .title {
        display: none;
        line-height: $liLineHeight;
        white-space: nowrap;
      }
      .sub,
      .sub__show {
        display: none;
        position: absolute;
        right: 10px;
        top: 0;
        width: 20px;
        line-height: $liLineHeight;
        font-size: 1rem;
      }
      .sub__show {
        transform: rotate(90deg);
      }
      &.router-link-active {
        background-color: $FLBG_Active_Color;
        color: $SL_Color;
      }
      &:hover,
      &.router-link-exact-active {
        background-color: $FLBG_Active_Color;
        color: $FL_Active_Color;
      }
    }
    .smenu {
      display: none;
      background-color: $FLBG_Color;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
      li {
      background-color: $SLBG_Color;
        a {
          display: block;
          font-size: 1.4rem;
          color: $SL_Color;
          text-align: left;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          .title {
            display: inline;
            line-height: $liLineHeight;
            white-space: nowrap;
          }
          &:hover,
          &.router-link-exact-active {
            background-color: $SLBG_Active_Color;
            color: $SL_Active_Color;
          }
        }
      }
    }
  }
  .theme-dark & {
    >li {
      background-color: #272727;
      .smenu{
        background-color: #272727;
      }
    }
  }
  @media screen and (max-width: 768px) {
    >li {
      > a {
        .title {
          display: inline;
        }
        .sub,
        .sub__show {
          display: block;
        }
      }
      .smenu {
        display: block;
        li {
          a {
            padding: 0 $routePaddingWidth 0 68px;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .menu__normal > li {
    > a {
      .title {
        display: inline;
      }
      .sub,
      .sub__show {
        display: block;
      }
    }
    .smenu {
      display: block;
      li {
        a {
          padding: 0 $routePaddingWidth 0 68px;
        }
      }
    }
  }
  .menu__mini > li {
    &.item-parent> a {
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 5px;
        bottom: 12px;
        border-width: 3px;
        border-style: solid;
        // border-color: #999 #999 transparent transparent;
        border-color: transparent #999 #999 transparent;
      }
      &:hover {
        &::after {
          display: none;
        }
      }
    }
    .smenu {
      display: block;
      position: absolute;
      left: 100%;
      top: 0;
      width: 150px;
      animation: fade .2s linear;
      li {
        a {
          padding: 0 35px;
        }
      }
      @keyframes fade {
        from { opacity: 0 };
        to { opacity: 1 };
      }
    }
  }
}

</style>
