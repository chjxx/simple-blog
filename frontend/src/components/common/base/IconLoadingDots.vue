/**
 * 圆点加载icon
 */

<template>
  <div class="u-loadingdots">
    <span class="circle"></span>
    <span class="circle"></span>
    <span class="circle"></span>
  </div>
</template>

<script>

export default {
  name: 'IconLoadingDots'
};

</script>

<style lang="scss">
.u-loadingdots {
  .circle {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ccc;
    vertical-align: middle;
    &:not(:first-child){
      margin-left: 5px;
    }
  }
  .circle:nth-child(1){
    animation: opaciting 1s ease-in-out infinite;
  }
  .circle:nth-child(2){
    animation: opaciting 1s ease-in-out .33s infinite;
  }
  .circle:nth-child(3){
    animation: opaciting 1s ease-in-out .66s infinite;
  }
  .theme-dark & {
    .circle{
      background-color: #666;
    }
  }
}

@keyframes opaciting {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>