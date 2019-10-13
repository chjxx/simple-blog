/**
 * 文章列表组件
 */

<template>
  <div class="m-postlist" ref="test">
    <ul>
      <li
        v-for="(post, index) in processedPosts"
        :class="getPostClass(post)"
        :key="index"
        @click="openPost(post)"
      >
        <!-- 移动端显示的文章信息 -->
        <div class="mb-info">
          <span class="user">
            <span class="avatar" :style="{ backgroundImage: post.author.avatarCSSVal }"></span>
            {{ post.author.name }}
          </span>
          <span class="created-at">{{ post.createdAt }}</span>
        </div>
        <!-- 文章封面 -->
        <div
          v-if="post.coverCSSVal"
          class="cover"
          :style="{ backgroundImage: post.coverCSSVal }"
        ></div>
        <!-- 文章信息 -->
        <div class="info">
          <h2 class="tt">
            <a href="javascript:;" class="sd">{{ post.title }}</a>
          </h2>
          <p class="describe">
            <span>{{ post.describe }}</span>
          </p>
          <!-- PC端显示的文章信息 -->
          <div class="pc-info">
            <span class="user">
              <span class="avatar" :style="{backgroundImage: post.author.avatarCSSVal}"></span>
              {{ post.author.name }}
            </span>
            <span class="created-at">
              <i class="icon icondate"></i>{{ post.createdAt }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <!-- 加载状态条 -->
    <div class="statebar-ctnr" ref="stateBar">
      <BarState class="statebar" :state="state"></BarState>
      <BarTip class="tip" v-if="noPost">无文章</BarTip>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { isType, throttle } from 'common/scripts/utils';

const [LOADING, STOP, FINISH, ERROR, INITIAL] = ['loading', 'stop', 'finish', 'error', 'initial'];

export default {
  name: 'PostList',
  props: {
    fetch: {
      type: [Function, Object],
      require: true
    }
  },
  data() {
    return {
      rawPosts: [],
      state: INITIAL,
      scrollBoxListenr: null
    };
  },
  computed: {
    /**
     * 加工过的文章数据
     */
    processedPosts() {
      return this.rawPosts.map(rawPost => {
        return {
          id: rawPost._id,
          title: rawPost.title,
          coverCSSVal: rawPost.cover ? `url(${rawPost.cover})` : '',
          describe: rawPost.describe,
          commentsCount: rawPost.commentsCount,
          createdAt: moment(rawPost.created_at).format('YYYY年M月D日  hh:mm:ss'),
          author: {
            name: rawPost.author.name,
            avatarCSSVal: `url(${rawPost.author.avatar})`
          }
        };
      });
    },
    noPost() {
      return this.state === FINISH && !this.rawPosts.length;
    }
  },
  methods: {
    /**
     * 判断文章是否有封面，返回相应的class
     * @param  {Object} post
     * @return {string} class
     */
    getPostClass(post) {
      return post.coverCSSVal ? 'post__cover' : 'post';
    },
    /**
     * 获取文章
     */
    fetchPosts() {
      this.state = LOADING;

      this.fetch()
        .then(resData => {
          let postsCount = resData.data.count;
          this.rawPosts.push(...resData.data.chunk);
          // 如果保存的文章集合长度已经与服务器文章数量相等，则将状态切换于FINISH，不再加载文章
          this.state = this.rawPosts.length === postsCount ? FINISH : STOP;

          // 在文章列表渲染完成后再触发一个滚动事件，以防目前的文章列表没有占满一整屏
          this.$nextTick(() => {
            var evt = document.createEvent('HTMLEvents');

            evt.initEvent('scroll', false, false);

            this.$store.state.app.$scrollBox.dispatchEvent(evt);
          });
        })
        .catch(e => {
          this.state = ERROR;
        });
    },
    createScrollEvent() {
      return new Event('scroll', {
        bubbles: true,
        cancelable: true
      });
    },
    /**
     * 打开某篇文章
     * @param  {Object} post
     */
    openPost(post) {
      this.$router.push(`/posts/${post.id}`);
    }
  },
  watch: {
    /**
     * 监听文章获取函数的改变，清空原有文章数组，重新获取文章
     * @param  {Function} newFn
     */
    fetch(newFn) {
      this.rawPosts = [];
      this.state = INITIAL;

      if (isType(newFn, 'Function')) {
        this.fetchPosts();
      }
    },
    /**
     * 监听文章数组的改变，如果改变则通知父级
     * @param  {Array} newPosts
     */
    rawPosts(newPosts) {
      this.$emit('update', this.rawPosts);
    }
  },
  created() {
    if (isType(this.fetch, 'Function')) {
      this.fetchPosts();
    }
  },
  mounted() {
    this.$nextTick(() => {
      let windowHeight = window.innerHeight;
      // 监听窗口滚动
      this.scrollBoxListenr = throttle(e => {
        console.log('scroll')
        console.log(this.$refs);
        if (this.$refs.stateBar) {
          console.log('has statebar')
          // 获取状态条顶部写窗口顶部的距离
          let stateBarTop = this.$refs.stateBar.getBoundingClientRect().top;
          // 如果文章加载是暂停状态，进度条与窗口高度相同（即再向下滑的话在窗口中就能看到进度条），则继续加载文章
          console.log({stateBarTop}, {windowHeight});
          if (this.state === STOP && (stateBarTop <= windowHeight)) {
            this.fetchPosts();
          }
        }
      });

      this.$store.commit('app/addScrollBoxListener', this.scrollBoxListenr);
    });
  },
  beforeDestroy() {
    this.$store.commit('app/removeScrollBoxListener', this.scrollBoxListenr);
  }
};
</script>

<style lang="scss">

$coverWidth: 240px;
$itemPaddingWidth: 15px;
$linkColor: rgb(51, 51, 51);
$linkHoverColor: rgba(51, 51, 51, 0.75);

.m-postlist {
  padding: 8px;
  overflow: hidden;
  > ul {
    .post,
    .post__cover {
      $postMarginTop: 8px;
      margin-top: $postMarginTop;
      position: relative;
      padding: $itemPaddingWidth;
      background-color: #fff;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
      cursor: pointer;
      overflow: hidden;
      .mb-info {
        $height: 46px;
        display: none;
        position: relative;
        height: $height;
        font-size: 1.3rem;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        border-radius: 3px;
        background-color: #fdfdfd;
        color: rgb(124, 124, 124);
        .user,
        .created-at{
          display: inline-block;
          line-height: $height;
        }
        .user {
          line-height: $height;
          padding-left: $height;
          .avatar {
            $left: 8px;
            $avatarHeight: $height - $left * 2;
            display: block;
            position: absolute;
            top: $left;
            left: $left;
            width: $avatarHeight;
            height: $avatarHeight;
            background-color: #fff;
            background-position: center;
            background-size: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }
        }
        .created-at {
          position: absolute;
          right: 8px;
        }
      }
      .cover {
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .info {
        .tt {
          font-size: 2.2rem;
          line-height: 30px;
          > a {
            color: $linkColor;
            &:hover {
              color: $linkHoverColor;
            }
          }
        }
        .describe {
          margin-top: 5px;
          max-height: 90px;
          line-height:  24px;
          font-size: 1.4rem;
          color: #a0a0a0;
          overflow: hidden;
        }
        >.pc-info {
          $height: 18px;
          margin-top: 12px;
          height: $height;
          font-size: 1.2rem;
          color: #999;
          white-space: nowrap;
          overflow: hidden;
          .user,
          .created-at {
            display: inline-block;
            position: relative;
            height: 100%;
            padding-left: $height + 8px;
            margin-right: 15px;
            line-height: $height;
            &::after {
              content: '';
              display: inline-block;
              margin-left: 15px;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background-color: #eee;
            }
          }
          >span{
            >.icon, .avatar {
              position: absolute;
              display: inline-block;
              left: 0;
              top: 0;
              width: $height;
              height: $height;
            }
            >.icon {
              text-align: center;
              line-height: $height;
            }
            .avatar {
              background-color: #fff;
              border-radius: 50%;
              background-size: cover;
              background-position: center;
            }
            &:last-of-type {
              margin-right: 0;
              &::after {
                display: none;
              }
            }
          }
        }
      }
      &:first-of-type {
        margin-top: 0;
      }
    }
  }
  > .statebar-ctnr {
    $stateBarHeight: 50px;
    font-size: 1.4rem;
    .statebar {
      width: 100%;
      height: $stateBarHeight;
    }
    .tip {
      width: 100%;
      height: 50px;
    }
    > .state__finish {
      width: 100%;
      line-height: $stateBarHeight;
      text-align: center;
    }
  }
  .theme-dark & {
    >ul {
      .post,
      .post__cover {
        background-color: #1e1e1e;
        .mb-info{
          background-color: #1b1b1b;
        }
        .info {
          .tt {
            a {
              color: #b1b1b1;
              &:hover {
                color: #f1f1f1;
              }
            }
          }
          .describe {
            color: #777;
          }
          .pc-info {
            color: #606060;
            .user,
            .created-at {
              &::after{
                background-color: #333;
              }
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 501px) {
  .m-postlist {
    > ul {
      .post__cover {
        padding-right: $coverWidth + $itemPaddingWidth * 2;
        .cover {
          position: absolute;
          top: $itemPaddingWidth;
          bottom: $itemPaddingWidth;
          right: $itemPaddingWidth;
          width: $coverWidth;
          border-radius: 4px;
        }
        .info {
          .describe{
            min-height: 80px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .m-postlist {
    > ul {
      .post,
      .post__cover {
        padding: 0;
        .mb-info{
          display: block;
        }
        .cover {
          margin-top: -1px;
          &:before {
            content: '';
            display: block;
            padding-top: 50%;
          }
        }
        .info {
          padding: 14px;
          .describe {
            line-height: 24px;
          }
          .pc-info {
            display: none;
          }
        }
      }
    }
  }
}
</style>
