/**
 * 文章标签组件
 */

<template>
  <div class="m-tags">
    <div class="ctnr" v-show="isFinish">
      <div class="tags-ctrl">
        <div class="ct" v-if="!noTag">
          <div
            class="tag"
            :class="getTagClass(tag)"
            v-for="(count, tag) in tags"
            :key="tag"
            @click="toggleTagState(tag);"
          >
            {{ tag }} <span class="count">{{ count }}</span>
          </div>
        </div>
      </div>
      <div class="result">
        <BarTip class="tip" v-show="!checkedTags.length && !noTag">请选择标签</BarTip>
        <BarTip class="tip" v-if="noTag">无标签</BarTip>
        <PostList :fetch="fetchPosts" @update="updatePosts"></PostList>
      </div>
    </div>
    <BarState class="statebar" :state="optionBarState"></BarState>
  </div>
</template>

<script>
import PostList from 'components/common/PostList';
const [LOADING, ERROR, FINISH] = ['loading', 'error', 'finish'];

export default {
  name: 'Tags',
  components: { PostList },
  data() {
    return {
      // 所有文章的标签集
      tags: {},
      // 被选中的标签集
      checkedTags: [],
      // 筛选后的文章
      filteredPosts: [],
      optionBarState: FINISH,
      // 文章获取函数
      fetchPosts: null
    };
  },
  computed: {
    /**
     * 可选择的标签集
     * @return {Array}
     */
    optionalTags() {
      let postTags = this.filteredPosts.reduce((tags, post) => {
        post.tags.forEach(tag => {
          if (!tags.includes(tag)) tags.push(tag);
        });
        return tags;
      }, []);
      return postTags.length ? postTags : Object.keys(this.tags);
    },
    /**
     * Tags是否已经获取到
     * @return {Boolean}
     */
    isFinish() {
      return this.optionBarState === FINISH;
    },
    noTag() {
      return this.isFinish && !Object.keys(this.tags).length;
    }
  },
  methods: {
    /**
     * 获取tag的class
     * @param  {string} tag
     * @return {string} class
     */
    getTagClass(tag) {
      if (this.checkedTags.indexOf(tag) !== -1) {
        return 'u-tag1__checked';
      } else if (this.optionalTags.indexOf(tag) !== -1) {
        return 'u-tag1';
      } else {
        return 'u-tag1__disabled';
      }
    },
    /**
     * 处理tag点击事件，适当在已选择的tag的数组中删除和添加tag
     * @param  {string} tag
     */
    toggleTagState(tag) {
      // 如果tag是不可选择的则不做操作
      if (!this.optionalTags.includes(tag)) return;

      let index = this.checkedTags.indexOf(tag);

      // 更新已选择的tag数组
      if (index === -1) {
        this.checkedTags.push(tag);
      } else {
        this.checkedTags.splice(index, 1);
      }
    },
    /**
     * 获取Tags
     */
    fetchTags() {
      this.optionBarState = LOADING;
      this.$api.tags
        .get({ state: 'published' })
        .then(resData => {
          this.tags = resData.data;
          this.optionBarState = FINISH;
        })
        .catch(e => {
          this.optionBarState = ERROR;
        });
    },
    /**
     * 生成获取文章的函数
     * @return {Function}
     */
    generateFetchPostFn() {
      let vm = this;

      return offset => {
        return this.$api.posts.getByTags(vm.checkedTags);
      };
    },
    updatePosts(posts) {
      this.filteredPosts = posts;
    }
  },
  watch: {
    checkedTags(newVal) {
      if (newVal.length) {
        this.fetchPosts = this.generateFetchPostFn();
      } else {
        // 如果没有选中任何tag，fetch函数则设为null
        this.fetchPosts = null;
      }
    }
  },
  created() {
    this.fetchTags();
  }
};
</script>

<style lang="scss">
.m-tags {
  margin: 0 auto;
  max-width: 880px;
  .ctnr {
    .tags-ctrl {
      margin: 0 8px;
      line-height: 40px;
      box-shadow: 0 0px 2px rgba(255, 255, 255, .2);
      .ct {
        padding: 20px 15px;
        background-color: #fff;
        .tag {
          margin-right: 14px;
        }
      }
      @media screen and (max-width: 500px) {
        margin: 0;
      }
    }
    .result {
      position: relative;
      .tip{
        width: 100%;
        height: 50px;
      }
    }
  }
  >.statebar {
    width: 100%;
    height: 50px;
  }
  .theme-dark & {
    .ctnr {
      .tags-ctrl {
        .ct {
          background-color: #1e1e1e;
        }
      }
    }
  }
}
</style>
