/** * 账户登陆组件 */

<template>
  <form class="m-form-signcard" ref="form" @submit.prevent="signin">
    <!-- 用户名 -->
    <label class="text-item">
      <input
        class="u-ipt-text1"
        name="name"
        type="text"
        autocomplete="off"
        placeholder="用户名"
      />
      <i class="icon iconuser"></i>
    </label>
    <!-- 密码 -->
    <label class="text-item">
      <input
        class="u-ipt-text1"
        name="password"
        type="password"
        placeholder="密码"
      />
      <i class="icon iconlock"></i>
    </label>
    <!-- 提交按钮 -->
    <ButtonState class="submit" :state="state">登陆</ButtonState>
  </form>
</template>

<script>
import loadingPage from 'common/scripts/loadingPage';
import { checkAccountFormat } from 'common/scripts/check';
import { isType } from 'common/scripts/utils';

const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'SignIn',
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
    showMsg(message) {
      this.$emit('message', message);
    },
    cleanMsg() {
      this.$emit('message', '');
    },
    signin() {
      this.cleanMsg();
      // 获取表格数据
      let formData = new FormData(this.$refs.form);
      // 验证表格数据格式
      let result = checkAccountFormat(formData);
      // 如果表格数据格式有错误
      if (isType(result, 'Error')) {
        this.showMsg(result.message);
        return;
      }

      this.state = LOADING;

      this.$api.users
        .signInByAdmin(formData)
        .then(resData => {
          this.state = FINISH;
          // 显示加载页面
          loadingPage.show();
          // 前往管理后台
          this.$router.push('/admin');
        })
        .catch(e => {
          this.state = FINISH;
          this.showMsg(e.message);
        });
    }
  }
};
</script>
