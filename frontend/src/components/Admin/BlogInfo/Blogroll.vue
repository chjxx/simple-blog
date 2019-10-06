/**
 * 博客友链更改组件
 */

<template>
  <div class="blogroll">
    <header>友情链接</header>
    <form @submit.prevent="updateBlogroll" @input="autoInsertItem">
      <div
        class="inputs-item"
        v-for="(item, index) in bloginfoCopy.blogroll"
        :key="index"
      >
        <input
          class="u-ipt-text1"
          type="text"
          v-model="item.name"
          placeholder="名称"
          autocomplete="off"
        />
        <input
          class="u-ipt-text1"
          type="text"
          v-model="item.link"
          placeholder="链接"
          autocomplete="off"
        />
      </div>
      <ButtonState class="btn-submit" :state="state">保存</ButtonState>
    </form>
  </div>
</template>

<script>
import { cloneDeep } from 'common/scripts/utils';
const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'Blogroll',
  props: {
    bloginfo: {
      type: Object
    }
  },
  data() {
    return {
      bloginfoCopy: null,
      state: FINISH
    };
  },
  methods: {
    /**
     * 插入一组友链输入框
     */
    insertItem() {
      this.bloginfoCopy.blogroll.push({ name: '', link: '' });
    },
    /**
     * 自动判断及适时插入新输入框
     */
    autoInsertItem() {
      let blogroll = this.bloginfoCopy.blogroll;
      let lastBlogrollItem = blogroll[blogroll.length - 1];
      // 如果最后一组输入框都有文本，则插入一组新的输入框
      if (lastBlogrollItem.name !== '' && lastBlogrollItem.link !== '') {
        this.insertItem();
      }
    },
    updateBlogroll() {
      let vm = this;
      let formData = new FormData();

      vm.state = LOADING;
      // 剔除空的友链键值对
      let blogroll = this.bloginfoCopy.blogroll.filter(item => {
        return item.name.trim() !== '' && item.link.trim() !== '';
      });
      // 将原有的数组转成字符串，以便传输及后续服务端的处理
      formData.set('blogroll', JSON.stringify(blogroll));
      // 两个cb，第一个是成功的回调，第二个是失败的回调
      this.$emit('update', formData, cb, cb);

      function cb() {
        vm.state = FINISH;
      }
    }
  },
  created() {
    this.bloginfoCopy = cloneDeep(this.bloginfo);
    // 初始化先手动插入一组新的输入框，后续会跟据文本的输入来判断及自动插入
    this.insertItem();
  }
};
</script>

<style lang="scss" scoped>
.blogroll {
  $textItemHeight: 38px;
  $itemInterval: 20px;
  $textIptColor: #666;
  $textIptBorderColor: rgb(221, 221, 221);
  $textIptBorderColor_Focus: rgb(204, 204, 204);
  margin: 0 auto;
  max-width: 880px;
  border-radius: 3px;
  background-color: #fff;
  header {
    padding: 20px;
    font-size: 1.7rem;
    font-weight: 100;
    border-bottom: 1px solid rgb(221, 221, 221);
  }
  form {
    padding: $itemInterval;
    .inputs-item {
      position: relative;
      color: textIptColor;
      font-size: 0;
      > input {
        height: $textItemHeight;
        padding: 0 10px;
        &:focus + .icon {
          color: #999;
        }
        &:nth-child(1) {
          width: calc((100% - 15px) / 2);
        }
        &:nth-child(2) {
          margin-left: 15px;
          width: calc((100% - 15px) / 2);
        }
      }
      @media screen and (max-width: 500px) {
        input:nth-child(1),
        input:nth-child(2) {
          display: block;
          margin: 0;
          width: 100%;
        }
        input:nth-child(2) {
          margin-top: $itemInterval;
        }
      }
      &:not(:first-of-type) {
        margin-top: $itemInterval;
      }
    }
    .btn-submit {
      margin-top: 40px;
      width: 100%;
      height: 36px;
      line-height: 36px;
    }
  }
  .theme-dark & {
    background-color: #1e1e1e;
    color: #a1a1a1;
    header {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
  @media screen and (max-width: 768px) {
    header {
      padding: 15px;
    }
  }
}
</style>
