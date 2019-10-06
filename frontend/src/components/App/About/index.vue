/**
 * 博客有关信息组件
 */

<template>
  <div class="m-about">
    <div class="ct markdown-body" v-if="about" v-html="content"></div>
    <BarTip class="tip" v-if="!about">无博客相关信息</BarTip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import marked from 'marked';

export default {
  name: 'About',
  computed: {
    ...mapGetters('blog', ['about']),
    content() {
      return marked(this.about);
    }
  }
};
</script>

<style lang="scss">

.m-about {
  margin: 0 auto;
  max-width: 880px;
  .ct {
    padding: 20px;
    background-color: #fff;
    ul {
      list-style: disc;
    }
    ol {
      list-style: decimal;
    }
    @media screen and (max-width: 500px) {
      padding: 15px;
    }
  }
  .tip {
    width: 100%;
    height: 50px;
  }
  .theme-dark & .ct {
    background-color: #1e1e1e;
  }
}
</style>
