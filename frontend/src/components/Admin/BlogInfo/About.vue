/**
 * 博客有关信息更改组件
 */

<template>
  <div class="about">
    <header>
      <span class="tt">博客说明</span>
      <ButtonState
        class="btn-submit"
        :state="state"
        @click="updateAboutContent"
      >保存</ButtonState>
    </header>
    <div class="editor-ctnr">
      <Markdown :content="bloginfoCopy.about" ref="md"></Markdown>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'common/scripts/utils';
import Markdown from 'components/common/Markdown';
const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'About',
  components: { Markdown },
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
    updateAboutContent() {
      let vm = this;
      let formData = new FormData();

      this.state = LOADING;

      this.$refs.md.getContent().then(about => {
        formData.set('about', about);
        // 两个cb，第一个是成功的回调，第二个是失败的回调
        this.$emit('update', formData, cb, cb);
      }, cb);

      function cb() {
        vm.state = FINISH;
      }
    }
  },
  created() {
    // 拷贝一份方便后续直接修改而不会改动到原有数据
    this.bloginfoCopy = cloneDeep(this.bloginfo);
  }
};
</script>

<style lang="scss">
.about {
  $headerHeight: 60px;
  height: calc(100vh - 40px);
  border-radius: 3px;
  background-color: #fff;
  overflow: hidden;
  header {
    padding: 0 15px;
    line-height: $headerHeight;
    font-size: 1.7rem;
    font-weight: 100;
    border-bottom: 1px solid rgb(221, 221, 221);
    .btn-submit {
      float: right;
      margin-top: 10px;
      width: 70px;
      height: 36px;
      line-height: 36px;
    }
  }
  .editor-ctnr {
    height: calc(100% - 60px);
  }
  .theme-dark & {
    background-color: #1e1e1e;
    color: #a1a1a1;
    header {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
  @media screen and (max-width: 768px) {
    height: calc(100vh - 70px);
  }
}
</style>
