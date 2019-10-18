/**
 * 账户基础信息更改组件
 */

<template>
  <div class="baseinfo">
    <header>账号基础信息</header>
    <form
      class="m-form-setting"
      ref="form"
      @submit.prevent="updateBaseinfo"
    >
      <!-- 头像 -->
      <div class="img-item">
        <span class="title">头像：</span>
        <div
          class="preview"
          :style="{ backgroundImage: avatarCSSVal }"
        ></div>
        <label class="change">
          修改
          <input
            name="avatar"
            type="file"
            ref="avatar"
            accept="image/*"
            @change="changeAvatar"
          />
        </label>
      </div>
      <!-- 用户名 -->
      <div class="info-item">
        <span class="title">用户名： </span>
        <span class="val">{{ account.name }}</span>
      </div>
      <!-- 邮箱 -->
      <div class="info-item">
        <span class="title">邮箱： </span>
        <span class="val">{{ account.email }}</span>
      </div>
      <!-- 性别 -->
      <div class="radio-item">
        <span class="title">性别： </span>
        <div class="radio-ctnr">
          <label v-for="(item, index) in gender" :key="index" class="list-item">
            <input
              type="radio"
              name="gender"
              :value="item.value"
              v-model="account.gender"
            />
            <span class="icon"></span> <span class="desc">{{ item.title }}</span>
          </label>
        </div>
      </div>
      <!-- 个人简介 -->
      <label class="textarea-item">
        <span class="title">个人简介： </span>
        <InputAutoSize ref="bio" :content="account.bio"></InputAutoSize>
        <!-- <textarea name="bio" class="u-ipt-text1" v-model="account.bio"></textarea> -->
      </label>
      <!-- 提交按钮 -->
      <div class="submit">
        <ButtonState class="btn" :state="state">保存</ButtonState>
      </div>
    </form>
  </div>
</template>

<script>
import { compressImage } from 'common/scripts/fileUtils';

const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'BaseInfo',
  props: {
    account: {
      type: Object
    }
  },
  data() {
    return {
      avatarChanged: false,
      state: FINISH,
      gender: [
        {
          title: '保密',
          value: 'x'
        },
        {
          title: '男',
          value: 'm'
        },
        {
          title: '女',
          value: 'f'
        }
      ]
    };
  },
  computed: {
    avatarCSSVal() {
      return `url(${this.account.avatar || ''})`;
    }
  },
  methods: {
    /**
     * 修改头像
     */
    changeAvatar() {
      this.avatarChanged = true;
      this.account.avatar = window.URL.createObjectURL(
        this.$refs.avatar.files[0]
      );
    },
    /**
     * 更新信息
     */
    updateBaseinfo() {
      let vm = this;
      let formData = new FormData(this.$refs.form);

      this.state = LOADING;

      return new Promise((resolve, reject) => {
        if (this.avatarChanged) {
          compressImage(this.$refs.avatar.files[0], {
            eWidth: 300,
            eHeight: 300,
            size: 'cut',
            position: {
              x: 'center',
              y: 'middle'
            }
          }).then(blob => {
            formData.set('avatar', blob, `avatar.${blob.type.split('/').pop()}`);

            resolve();
          });
        } else {
          formData.set('bio', this.$refs.bio.getContent());
          // 如果头像未改变，则删除avatar字段
          formData.delete('avatar');

          resolve();
        }
      }).then(() => {
        // 更新信息，第一个cb为成功的回调，第二个cb为失败的回调
        this.$emit('update', formData, cb, cb);
      });

      function cb() {
        vm.state = FINISH;
      }
    }
  }
};
</script>

<style lang="scss">
.baseinfo {
  header {
    padding: 20px;
    font-size: 1.7rem;
    font-weight: 100;
    border-bottom: 1px solid rgb(221, 221, 221);
  }
  .theme-dark & {
    header {
      border-color: rgba(255, 255, 255, .1);
    }
  }
}
</style>
