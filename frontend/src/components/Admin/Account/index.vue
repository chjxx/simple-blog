/**
 * 账户信息更改主组件
 */

<template>
  <div class="m-account">
    <div class="account-card" v-if="account">
      <router-view
        :account="account"
        @update="updateAccountInfo"
      ></router-view>
    </div>
    <BarState class="statebar" :state="state"></BarState>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { checkAccountFormat } from 'common/scripts/check';
import { isType } from 'common/scripts/utils';

const [LOADING, ERROR, FINISH] = ['loading', 'error', 'finish'];

export default {
  name: 'Account',
  data() {
    return {
      account: null,
      state: FINISH
    };
  },
  methods: {
    ...mapActions('admin', ['notify']),
    getAccountInfo() {
      this.state = LOADING;
      this.$api.users
        .getAccountInfo()
        .then(resData => {
          this.account = resData.data;
          this.state = FINISH;
        })
        .catch(e => {
          this.state = ERROR;
        });
    },
    /**
     * 更新账户信息
     * @param  {FormData} formData 账户信息表格
     * @param  {Function} successCB 成功的回调
     * @param  {Function} errorCB 失败的回调
     */
    updateAccountInfo(formData, successCB, errorCB) {
      let isUpdatePassword = formData.get('password') !== null;
      let promise;

      // 检查格式是否合格
      let result = checkAccountFormat(formData);
      // 如果格式不合格，则提示，不作进一步处理
      if (isType(result, 'Error')) {
        this.notify({ type: 'error', content: result.message });
        return errorCB();
      }

      if (isUpdatePassword) {
        promise = this.updatePassword(formData);
      } else {
        promise = this.updateBaseInfo(formData);
      }

      promise
        .then(resData => {
          this.notify({ type: 'success', content: resData.message });
          successCB();
          // 如果是修改基础信息的话就替换原有保存的信息
          if (!isUpdatePassword) this.account = resData.data;
        })
        .catch(e => {
          this.notify({ type: 'error', content: e.message });
          errorCB(e);
        });
    },
    updateBaseInfo(formData) {
      return this.$api.users.update(formData);
    },
    updatePassword(formData) {
      return this.$api.users.updatePassword(formData);
    }
  },
  created() {
    this.getAccountInfo();
  }
};
</script>

<style lang="scss">
$navHeight: 65px;

.m-account {
  margin: 0 auto;
  position: relative;
  max-width: 1020px;
  min-width: 300px;
  padding: 20px;
  .account-card {
    margin: 0 auto;
    max-width: 880px;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  }
  .statebar {
    width: 100%;
    height: 50px;
  }
  .theme-dark & {
    .account-card {
      background-color: #1e1e1e;
      color: #a1a1a1;
    }
  }
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
}
</style>
