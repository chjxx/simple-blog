/**
 * 账户注册组件
 */

<template>
  <form class="m-form-signcard" ref="form" @submit.prevent="signup">
    <!-- 头像 -->
    <label class="avatar-item">
      <div
        class="preview"
        :style="{ backgroundImage: avatarCSSVal }"
      ></div>
      <input
        name="avatar"
        type="file"
        ref="avatar"
        accept="image/*"
        @change="changeAvatar"
      />
      <i class="icon iconplus"></i>
    </label>
    <!-- 用户名 -->
    <label class="text-item">
      <input
        class="u-ipt-text1"
        type="text"
        name="name"
        autocomplete="off"
        placeholder="用户名"
      />
      <i class="icon iconuser"></i>
    </label>
    <!-- 邮箱 -->
    <label class="text-item">
      <input
        class="u-ipt-text1"
        type="email"
        name="email"
        autocomplete="off"
        placeholder="邮箱"
      />
      <i class="icon iconemail"></i>
    </label>
    <!-- 密码 -->
    <label class="text-item">
      <input class="u-ipt-text1" name="password" type="password" placeholder="密码"/>
      <i class="icon iconlock"></i>
    </label>
    <!-- 确认密码 -->
    <label class="text-item">
      <input class="u-ipt-text1" name="confirmpassword" type="password" placeholder="确认密码" />
      <i class="icon iconlock"></i>
    </label>
    <!-- 提交按钮 -->
    <ButtonState class="submit" :state="state">注册</ButtonState>
  </form>
</template>

<script>
import { checkAccountFormat } from 'common/scripts/check';
import { isType } from 'common/scripts/utils';
import { compressImage } from 'common/scripts/fileUtils';

const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'SignIn',
  data() {
    return {
      state: FINISH,
      avatarUrl: ''
    };
  },
  computed: {
    isLoading() {
      return this.state === LOADING;
    },
    isFinish() {
      return this.state === FINISH;
    },
    avatarCSSVal() {
      return `url(${this.avatarUrl})`;
    }
  },
  methods: {
    test() {
      this.$emit('switch', 'SignIn');
    },
    showMsg(message) {
      this.$emit('message', message);
    },
    cleanMsg() {
      this.$emit('message', '');
    },
    signup() {
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

      compressImage(this.$refs.avatar.files[0], {
        eWidth: 300,
        eHeight: 300,
        size: 'cut',
        position: {
          x: 'center',
          y: 'middle'
        }
      }).then(blog => {
        this.state = LOADING;

        formData.set('avatar', blog, `avatar.${blog.type.split('/').pop()}`);

        this.$api.users
          .signUpByAdmin(formData)
          .then(resData => {
            this.state = FINISH;
            this.$emit('switch', 'SignIn');
            this.$emit('message', '注册成功，请登陆！');
          })
          .catch(e => {
            this.state = FINISH;
            this.showMsg(e.message);
          });
      });
    },
    /**
     * 改变图片地址
     */
    changeAvatar() {
      this.avatarUrl = window.URL.createObjectURL(this.$refs.avatar.files[0]);
    }
  }
};
</script>