/**
 * 博客头部组件
 */

<template>
  <header class="m-hd">
    <div :class="switchBtnStateClass" @click.stop="switchNav">
      <i class="midline"></i>
    </div>
    <p class="blogname">{{ blogName }}</p>
    <button class="ctrl-theme u-btn2 icon" :class="nextTheme.icon" @click="switchToNextTheme"></button>
  </header>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Header',
  computed: {
    ...mapState('app', ['navShow']),
    ...mapGetters('blog', ['blogName', 'nextTheme']),
    switchBtnStateClass() {
      return this.navShow ? 'nav-switch-icon__close' : 'nav-switch-icon';
    }
  },
  methods: {
    ...mapMutations('app', ['switchNav']),
    ...mapMutations('blog', ['switchToNextTheme'])
  }
};
</script>

<style lang="scss">
$headerHeight: 50px;
$buttonWidth: 25px;
$navBgColor: #212d33;
$color: #f1f1f1;
$buttonLeft: ($headerHeight - $buttonWidth) / 2;
$buttonBorderStyle: 2px solid $color;

.m-hd {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $headerHeight;
  background-color: $navBgColor;
  color: $color;
  box-shadow: 0 1px 2px rgba(0,0,0,.2);
  overflow: hidden;
  z-index: 5;
  %navSwitchIcon {
    position: absolute;
    left: $buttonLeft;
    top: $buttonLeft;
    width: $buttonWidth;
    height: $buttonWidth;
    cursor: pointer;
    .midline {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      border-bottom: $buttonBorderStyle;
      border-radius: 1px;
    }
    &::before,
    &::after {
      display: block;
      content: '';
      top: 50%;
      position: absolute;
      left: 0;
      width: 100%;
      border-bottom: $buttonBorderStyle;
      border-radius: 1px;
    }
  }
  .nav-switch-icon {
    @extend %navSwitchIcon;
    &::before {
      transform: translate3d(0, -10px, 0);
    }
    &::after {
      transform: translate3d(0, 10px, 0);
    }
    &:hover {
      opacity: .8;
    }
  }
  .nav-switch-icon__close {
    @extend %navSwitchIcon;
    .midline {
      opacity: 0;
    }
    &::before {
      transform: translate3d(0, 0, 0) rotate(45deg);
    }
    &::after {
      transform: translate3d(0, 0, 0) rotate(-45deg);
    }
    &:hover {
      opacity: .8;
    }
  }
  .blogname {
    margin: 0 50px;
    height: $headerHeight;
    font-size: 1.6rem;
    text-align: center;
    line-height: $headerHeight;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ctrl-theme {
    position: absolute;
    right: 0;
    top: 0;
    width: $headerHeight;
    height: $headerHeight;
    font-size: 1.8rem;
    background-color: transparent;
    color: $color;
  }
  .theme-dark & {
    background-color: #1f1f1f;
    color: #e1e1e1;
  }
}

@media screen and (max-width: 768px) {
  .m-hd {
    display: block;
  }
}
</style>
