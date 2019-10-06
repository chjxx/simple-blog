/** * 文章搜索组件 */

<template>
  <div class="m-search">
    <div class="searchbar-ctnr">
      <form class="ct" @submit.prevent="search" ref="form">
        <div class="wrap u-ipt-text2">
          <input
            type="text"
            v-model="searchInput"
            placeholder="输入关键字"
            autocomplete="off"
          />
          <button type="submit"><i class="icon iconsearch"></i></button>
        </div>
      </form>
    </div>
    <div class="result"><PostList :fetch="fetchPosts"></PostList></div>
  </div>
</template>

<script>
import PostList from 'components/common/PostList';

export default {
  name: 'Search',
  components: { PostList },
  data() {
    return {
      // 搜索关键字
      searchInput: '',
      // 文章获取函数
      fetchPosts: null
    };
  },
  methods: {
    /**
     * 生成特定关键字的文章获取函数
     * @return {Function}
     */
    generateFetchPostFn() {
      let vm = this;
      if (vm.searchInput.trim() === '') return null;

      return offset => {
        return this.$api.posts.getByKey(vm.searchInput.trim());
      };
    },
    search(e) {
      // 生成特定关键字的文章获取函数，替换原先的函数之后PostList组件会监听到这一变化，并重新以新的函数获取文章
      this.fetchPosts = this.generateFetchPostFn();
      // 取消focus
      document.activeElement.blur();
    }
  }
};
</script>

<style lang="scss">
.m-search {
  margin: 0 auto;
  max-width: 880px;
  .searchbar-ctnr {
    margin: 0 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 0px 2px rgba(0, 0, 0, 0.2);
    .ct {
      .wrap {
        margin: 0 auto;
        max-width: 400px;
      }
    }
    @media screen and (max-width: 500px) {
      margin: 0;
    }
  }
  .theme-dark & {
    .searchbar-ctnr {
      background-color: #1e1e1e;
    }
  }
}
</style>
