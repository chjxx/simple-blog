/**
 * 归档文章组件
 */

<template>
  <div class="m-archives">
    <div class="ctnr" v-show="rawPosts.length">
      <ul class="list">
        <li
          v-for="(liContent, index) in liContentList"
          :key="index"
          :class="liClass(liContent)"
        >
          <span v-if="typeof liContent === 'string'">{{ liContent }}</span>
          <span v-else @click.prevent="openPost(liContent._id);">{{ liContent.title }}</span>
        </li>
      </ul>
    </div>
    <BarState class="statebar" :state="state"></BarState>
    <BarTip class="tip" v-if="noPost">无文章</BarTip>
  </div>
</template>

<script>
import moment from 'moment';

const [LOADING, FINISH, ERROR] = ['loading', 'finish', 'error'];

export default {
  name: 'Archives',
  data() {
    return {
      rawPosts: [],
      state: FINISH
    };
  },
  computed: {
    /**
     * 根据文章的创建时间顺序生成一个list
     */
    liContentList() {
      let postsCopy = this.rawPosts.concat();
      let list = [];
      let lastDate = '';
      // 按创建时间降序排序
      postsCopy.sort((a, b) => {
        return b.created_at - a.created_at;
      });

      postsCopy.forEach(post => {
        let date = moment(post.created_at).format('YYYY年M月');

        // 如果最近一次保存的月份与当前文章创建月份不一样，则将当前月份推入list，以隔开月份不同的文章
        if (lastDate !== date) {
          lastDate = date;
          list.push(date);
        }

        list.push(post);
      });

      return list;
    },
    noPost() {
      return (!this.rawPosts.length) && this.state === FINISH;
    }
  },
  methods: {
    liClass(item) {
      return typeof item === 'string' ? 'title' : 'post';
    },
    /**
     * 获取已发布的文章数据
     */
    fetchPublishedPosts() {
      this.state = LOADING;
      this.$api.posts
        .getPublished({ quality: 'lite' })
        .then(resData => {
          this.rawPosts = resData.data;
          this.state = FINISH;
        })
        .catch(e => {
          this.state = ERROR;
        });
    },
    openPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  },
  created() {
    this.fetchPublishedPosts();
  }
};
</script>

<style lang="scss">
.m-archives {
  margin: 0 auto;
  max-width: 800px;
  font-size: 1.6rem;
  .ctnr {
    $linkColor: rgb(23, 81, 153);
    $linkHoverColor: rgb(54, 141, 249);
    padding: 30px;
    background-color: #fff;
    ul {
      list-style: disc;
      > li {
        padding: 6px 0;
        line-height: 22px;
      }
      .title {
        margin: 20px 0 0 20px;
        font-weight: 700;
        &:first-child {
          margin-top: 0;
        }
      }
      .post {
        margin-left: 40px;
        color: $linkColor;
        span {
          &:hover {
            color: $linkHoverColor;
          }
        }
      }
      @media screen and (max-width: 500px) {
        .title {
          margin-left: 10px;
        }
        .post {
          margin-left: 30px;
        }
      }
    }
  }
  .statebar {
    width: 100%;
    height: 50px;
  }
  .tip {
    width: 100%;
    height: 50px;
  }
  .theme-dark & >.ctnr {
    background-color: #1e1e1e;
    color: #a1a1a1;
  }
}
</style>
