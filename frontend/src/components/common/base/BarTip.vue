<template>
  <div class="m-tipbar">
    <span class="tipbar-ct">- <slot></slot> -</span>
  </div>
</template>

<style lang="scss">

.m-tipbar {
  display: table;
  font-size: 1.4rem;
  color: #888;
  .tipbar-ct {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }
  .theme-dark & {
    color: #666;
  }
}

</style>