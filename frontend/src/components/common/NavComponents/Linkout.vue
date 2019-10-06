/**
 * 外链组件（供导航条用）
 */

<template>
  <div class="linkout">
    <a
      v-for="link in linkout"
      :key="link.name"
      :href="link.site"
      target="_blank"
    >
      <i class="icon" :class="link.icon"></i>
    </a>
  </div>
</template>

<script>

export default {
  name: 'Linkout',
  props: {
    linkout: {
      type: Array
    }
  }
};

</script>

<style lang="scss">
$sidebarNormalWidth: 200px;
$sidebarMiniWidth: 65px;

.linkout {
  $iconWidth: 25px;
  $padding: ($sidebarMiniWidth - $iconWidth) / 2;
  $iconMarginRight: ($sidebarNormalWidth - $iconWidth * 4 - $padding * 2) / 3;
  padding: 50px $padding;
  font-size: 0;
  a {
    display: inline-block;
    margin: 0 $iconMarginRight 20px 0;
    width: 25px;
    text-decoration: none;
    text-align: center;
    color: #bec4ca;
    &:nth-child(4n) {
      margin: 0 0 20px 0;
    }
    &:hover {
      color: #edeff1;
      transform: scale(1.1);
    }
    >.icon {
      font-size: 2rem;
      text-align: center;
    }
  }
}

</style>