/**
 * 博客信息组件（供导航条用）
 */

<template>
  <div :class="bloginfoStateClass">
    <i class="logo" :style="{ backgroundImage: logoCssVal }"></i>
    <span class="name">{{ blogName }}</span>
  </div>
</template>

<script>

export default {
  name: 'Bloginfo',
  props: {
    normalNav: {
      type: Boolean
    },
    blogName: {
      type: String
    },
    logoCssVal: {
      type: String
    }
  },
  computed: {
    bloginfoStateClass() {
      return this.normalNav ? 'bloginfo__normal' : 'bloginfo__mini';
    }
  }
};

</script>

<style lang="scss">
$sidebarMiniWidth: 65px;

.bloginfo__normal,
.bloginfo__mini {
  $logoWidth: 40px;
  $infoPaddingWidth: ($sidebarMiniWidth - $logoWidth) / 2;
  width: 100%;
  padding: 30px $infoPaddingWidth;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .logo {
    display: inline-block;
    width: $logoWidth;
    height: $logoWidth;
    border-radius: 50%;
    background-color: #fff;
    background-size: cover;
    background-position: center;
    vertical-align: top;
  }
  .name {
    display: none;
    margin-left: 10px;
    font-size: 2rem;
    line-height: $logoWidth;
    color: #fff;
  }
  @media screen and (max-width: 768px) {
    .name {
      display: inline;
    }
  }
}

@media screen and (min-width: 769px) {
  .bloginfo__normal {
    .name {
      display: inline;
    }
  }
}

</style>