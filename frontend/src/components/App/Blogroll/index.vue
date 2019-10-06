/**
 * 博客友链组件
 */

<template>
  <div class="m-blogroll">
    <div class="ctnr" v-if="blogroll.length">
      <ul>
        <li v-for="(site, index) in blogroll" :key="index">
          <a :href="site.link" target="_blank">{{ site.name }}</a>
        </li>
      </ul>
    </div>
    <BarTip class="tip" v-if="!blogroll.length">无友链</BarTip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Blogroll',
  computed: {
    ...mapGetters('blog', ['blogroll'])
  }
};
</script>

<style lang="scss">
$linkColor: rgb(23, 81, 153);
$linkHoverColor: rgb(54, 141, 249);

.m-blogroll {
  margin: 0 auto;
  max-width: 880px;
  .ctnr {
    padding: 20px;
    font-size: 1.6rem;
    background-color: #fff;
    > ul {
      list-style-type: disc;
      padding: 0 20px;
      > li {
        padding: 6px 0;
        line-height: 22px;
        > a {
          text-decoration: none;
          color: $linkColor;
          &:hover {
            color: $linkHoverColor;
          }
        }
      }
    }
  }
  .tip {
    width: 100%;
    height: 50px;
  }
  .theme-dark & {
    color: #a1a1a1;
    .ctnr {
      background-color: #1e1e1e;
    }
  }
}
</style>
