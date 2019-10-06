/**
 * 404页面组件
 */

<template>
  <div class="error-page">
    <div class="ctnr">
      <p class="code">404</p>
      <p class="description">页面未找到，返回<router-link to="/">主页</router-link></p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Errorpage'
};

</script>
<style lang="scss">
.error-page {
  height: 100%;
  text-align: center;
  .code {
    margin-top: 100px;
    font-size: 15rem;
    color: #fff;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
  }
  .description {
    margin-top: 30px;
    font-size: 1.6rem;
    color: #777;
  }
  .theme-dark & {
    .code {
      color: #aaa;
      text-shadow: 0 1px 0 #777, 0 2px 0 #696969, 0 3px 0 #666, 0 4px 0 #595959, 0 5px 0 #555, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
    }
  }
}
</style>