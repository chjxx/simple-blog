/**
 * 博客信息更改主组件
 */

<template>
  <div class="m-bloginfo" v-if="bloginfo">
    <router-view
      class="bloginfo-card"
      :bloginfo="bloginfo"
      @update="updateBloginfo"
    ></router-view>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BlogInfo',
  computed: {
    ...mapState('blog', {
      bloginfo: state => state.info
    })
  },
  methods: {
    ...mapActions('blog', {
      putBloginfo: 'putInfo'
    }),
    /**
     * 更新博客信息
     * @param  {FormData} formData 信息表格数据
     * @param  {Function} successCB 成功的回调
     * @param  {Function} errorCB 失败的回调
     */
    updateBloginfo(formData, successCB, errorCB) {
      this.putBloginfo(formData).then(successCB, errorCB);
    }
  }
};
</script>

<style lang="scss">
.m-bloginfo {
  margin: 0 auto;
  position: relative;
  min-width: 300px;
  padding: 20px;
  .bloginfo-card {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
}
</style>
