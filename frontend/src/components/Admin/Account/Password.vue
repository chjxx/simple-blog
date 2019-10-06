/**
 * 账户密码更改组件
 */

<template>
  <div class="account-password">
    <header>账号密码</header>
    <form class="m-form-setting" ref="form" @submit.prevent="update">
      <label class="input-item">
        <div class="title">原密码：</div>
        <input class="u-ipt-text1" type="password" name="password" />
      </label>
      <label class="input-item">
        <div class="title">新密码：</div>
        <input class="u-ipt-text1" type="password" name="newpassword" />
      </label>
      <div class="submit">
        <ButtonState class="btn" :state="state">保存</ButtonState>
      </div>
    </form>
  </div>
</template>

<script>
const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'Password',
  data() {
    return {
      state: FINISH
    };
  },
  computed: {
    isLoading() {
      return this.state === LOADING;
    },
    isFinish() {
      return this.state === FINISH;
    }
  },
  methods: {
    update() {
      let vm = this;
      let formData = new FormData(this.$refs.form);

      this.state = LOADING;

      // 更新信息，第一个cb为成功的回调，第二个cb为失败的回调
      this.$emit('update', formData, cb, cb);

      function cb() {
        vm.state = FINISH;
      }
    }
  }
};
</script>

<style lang="scss">
.account-password {
  header {
    padding: 20px;
    font-size: 1.7rem;
    font-weight: 100;
    border-bottom: 1px solid rgb(221, 221, 221);
  }
  .theme-dark & {
    header {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
