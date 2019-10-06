/**
 * 文章管理组件
 */

<template>
  <div class="m-postmanage">
    <div class="postmanage-card">
      <header class="card-hd">文章管理</header>
      <button class="btn-add u-btn3 icon iconplus1" @click="createPost">创建文章</button>
      <DataTable
        :source="source"
        @edit="editPost"
        @delete="deletePost"
        v-show="isFinish"
      ></DataTable>
      <BarState class="card-state" :state="state"></BarState>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';
import DataTable from 'components/common/DataTable';

const [LOADING, FINISH, ERROR] = ['loading', 'finish', 'error'];

export default {
  name: 'PostManage',
  components: { DataTable },
  data() {
    return {
      source: {
        // 列表头
        heads: {
          title: '文章标题',
          author: '作者',
          state: '状态',
          created_at: '创建日期',
          updated_at: '修改日期',
          pv: '浏览量'
        },
        // 列表数剧
        posts: [],
        // 列表控制选项
        control: [
          {
            icon: 'iconedit',
            title: '编辑',
            event: 'edit'
          },
          {
            icon: 'iconbin',
            title: '删除',
            event: 'delete'
          }
        ]
      },
      state: FINISH
    };
  },
  computed: {
    isFinish() {
      return this.state === FINISH;
    }
  },
  methods: {
    ...mapActions('admin', ['notify']),
    /**
     * 格式化文章时间戳
     * @param  {Array} posts
     * @return {Array} processedPosts
     */
    formatPostTime(posts) {
      return posts.map(post => {
        post.created_at = moment(post.created_at).format(
          'YYYY/M/D HH:mm:ss'
        );
        post.updated_at = moment(post.updated_at).format(
          'YYYY/M/D HH:mm:ss'
        );
        return post;
      });
    },
    /**
     * 获取文章列表
     */
    fetchPosts() {
      this.state = LOADING;

      this.$api.posts.get({ offset: 0, limit: 0 }).then(resData => {
        let posts = this.formatPostTime(resData.data.chunk);
        this.source.posts = posts;
        this.state = FINISH;
      }).catch(e => {
        this.state = ERROR;
      });
    },
    /**
     * 编辑文章
     * @param  {Object} post
     */
    editPost(post) {
      this.$router.push(`/admin/postedit/${post._id}`);
    },
    /**
     * 删除文章
     * @param  {Object} post
     */
    deletePost(post) {
      if (window.confirm(`确认删除文章： "${post.title}"`)) {
        this.$api.posts
          .delete(post._id)
          .then(resData => {
            this.notify({ type: 'success', content: resData.message });
            // 更新文章列表
            this.fetchPosts();
          })
          .catch(e => {
            this.notify({ type: 'error', content: e.message });
          });
      }
    },
    /**
     * 创建文章
     */
    createPost() {
      this.$router.push('/admin/postedit');
    }
  },
  created() {
    this.fetchPosts();
  }
};
</script>

<style lang="scss">
.m-postmanage {
  margin: 0 auto;
  max-width: 1020px;
  min-width: 300px;
  padding: 20px;
  .postmanage-card {
    position: relative;
    border-radius: 3px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
    .card-hd {
      padding: 20px;
      font-size: 1.7rem;
      font-weight: 100;
      border-bottom: 1px solid rgb(221, 221, 221);
    }
    .btn-add {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 90px;
      height: 36px;
      line-height: 36px;
      font-size: 1.2rem;
      &::before {
        margin-right: 5px;
      }
    }
    .card-state {
      width: 100%;
      height: 50px;
    }
  }
  .theme-dark & .postmanage-card {
    background-color: #1e1e1e;
    color: #a1a1a1;
    .card-hd {
      border-bottom-color: rgba(255, 255, 255, .1);
    }
    .state__loading {
      background-color: #1e1e1e;
    }
  }
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
}

</style>
