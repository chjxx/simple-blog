/**
 * 加载状态条
 */

<template>
  <div class="m-statebar" v-show="show">
    <IconLoadingDots class="statebar__loading" v-show="isLoading"></IconLoadingDots>
    <p class="statebar__error" v-show="isError">数据获取失败，请刷新重试！</p>
  </div>
</template>

<script>
const states = ['loading', 'error'];

export default {
  name: 'BarState',
  props: {
    state: {
      type: String
    }
  },
  computed: {
    isLoading() {
      return this.state === states[0];
    },
    isError() {
      return this.state === states[1];
    },
    /**
     * 是否显示
     * @return {boolean}
     */
    show() {
      return states.includes(this.state);
    }
  }
};

</script>

<style lang="scss">
.m-statebar {
  display: table;
  .statebar__loading,
  .statebar__error {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
  .statebar__error {
    font-size: 1.4rem;
    color: red;
  }
}
</style>
