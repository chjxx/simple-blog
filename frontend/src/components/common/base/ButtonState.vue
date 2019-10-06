/**
 * 具有状态的按钮
 */

<template>
  <div class="m-state-button u-btn1">
    <button
      v-show="isFinish || isDisabled"
      @click="click"
      :disabled="isDisabled"
    >
      <slot></slot>
    </button>
    <div v-show="isLoading" class="loading"><i class="icon iconload"></i></div>
  </div>
</template>

<script>
const [LOADING, FINISH, DISABLED] = ['loading', 'finish', 'disabled'];

export default {
  props: {
    state: {
      type: String
    }
  },
  computed: {
    isLoading() {
      return this.state === LOADING;
    },
    isFinish() {
      return this.state === FINISH;
    },
    isDisabled() {
      return this.state === DISABLED;
    }
  },
  methods: {
    click() {
      this.$emit('click');
    }
  }
};
</script>