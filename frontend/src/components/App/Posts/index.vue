/**
 * 已发布的文章列表主组件
 */

<template>
  <div class="m-posts">
    <PostList :fetch="fetchPosts" @update="updatePosts"></PostList>
  </div>
</template>

<script>
import PostList from 'components/common/PostList';

export default {
  name: 'Posts',
  components: { PostList },
  data() {
    return {
      rawPosts: []
    };
  },
  methods: {
    /**
     * 向服务器请求文章
     * @return {Promise}
     */
    fetchPosts() {
      return this.$api.posts.getPublished({ offset: this.rawPosts.length, limit: 5 });
    },
    updatePosts(posts) {
      this.rawPosts = posts;
    }
  }
};
</script>

<style lang="scss">

.m-posts {
  margin: 0 auto;
  max-width: 880px;
}

</style>
