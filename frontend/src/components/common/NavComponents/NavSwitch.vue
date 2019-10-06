/**
 * 导航条模式切换按钮组件（供导航条用）
 */

<template>
  <div :class="navSwitchClass">
    <i class="icon iconmore" @click="switchToNormalMode"></i>
  </div>
</template>

<script>

export default {
  name: 'NavSwitch',
  props: {
    normalNav: {
      type: Boolean
    }
  },
  computed: {
    navSwitchClass() {
      return this.normalNav ? 'navswitch__normal' : 'navswitch__mini';
    }
  },
  methods: {
    switchToNormalMode() {
      this.$emit('normal-mode');
    }
  }
};

</script>

<style lang="scss">

.navswitch__normal,
.navswitch__mini {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  >i {
    display: none;
    font-size: 2.5rem;
    cursor: pointer;
    &:hover {
      color: #fff;
    }
  }

}

@media screen and (min-width: 769px) {
  .navswitch__mini {
    >i{
      display: inline-block;
    }
  }
}

</style>