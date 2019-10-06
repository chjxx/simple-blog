/**
 * 圆圈加载框
 */

<template>
  <div class="m-loadingmask">
    <p class="ctnr">
      <i></i>
      <span class="">加载中...</span>
    </p>
  </div>
</template>

<script>

export default {
  name: 'MaskLoading'
};

</script>

<style lang="scss">

.m-loadingmask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .ctnr {
    $height: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    >i {
      display: inline-block;
      margin-right: 3px;
      width: $height;
      height: $height;
      vertical-align: top;
      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        border-width: 2px;
        border-style: solid;
        border-color: transparent #666 #666;
        border-radius: 50%;
        animation: rotate 1s linear infinite;
      }
    }
    >span {
      line-height: $height;
      font-size: 1.6rem;
      color: #666;
    }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}
</style>