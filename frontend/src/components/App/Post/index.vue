/**
 * 文章组件
 */

<template>
  <div class="m-post">
    <!-- 侧边目录 -->
    <div v-if="catalogList.length" class="aside-catalog-wrap">
      <div class="aside-catalog">
        <div class="tt">目录</div>
        <div class="ct-ctnr" ref="sideCatalogContainer">
          <ul class="ct catalog-list" ref="sideCatalog">
            <li v-for="(li, index) in catalogList" :key="li.id" :class="getCatalogItemClass(li, index)">
              <a :href="`#${li.id}`">{{ li.title }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 主体 -->
    <div class="ctnr" v-if="post">
      <header>
        <h1>{{ post.title }}</h1>
        <div class="tags-ctnr">
          <span class="tag" v-for="tag in post.tags" :key="tag">{{ tag }}</span>
        </div>
      </header>
      <!-- 主体目录，小屏时显示 -->
      <div class="catalog" v-if="catalogList.length">
        <h2 class="tt">目录</h2>
        <div class="ct">
          <ul class="catalog-list">
            <li v-for="li in catalogList" :key="li.id" :class="`level-${li.level}`">
              <a :href="`#${li.id}`">{{ li.title }}</a>
            </li>
          </ul>
        </div>
      </div>
      <!-- 文章内容 -->
      <div
        class="ct markdown-body"
        v-html="convertToInnerHTML(post.content)"
        ref="content"
      ></div>
      <!-- 文章相关信息 -->
      <div class="other">
        <span>作者: {{post.author.name}}</span>
        <span>最后编辑于 {{ post.updated_at }}</span>
      </div>
    </div>
    <BarState class="statebar" :state="state"></BarState>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import marked from 'marked';
import moment from 'moment';
import { throttle } from 'common/scripts/utils';

const [LOADING, ERROR, FINISH] = ['loading', 'error', 'finish'];

export default {
  name: 'Post',
  data() {
    return {
      // 文章数据
      post: null,
      // 目录数据
      catalogList: [],
      // 文章页面加载状态
      state: FINISH,
      // 文章内容标题的初始位置
      headElmInitialRects: [],
      // 文章目录的初始位置
      catalogElmInitialRects: [],
      // 当前屏幕正在显示的部分的head的索引
      focusingHeadIndex: null,
      throttledScrollListener: null
    };
  },
  methods: {
    ...mapMutations('app', ['addScrollBoxListener', 'removeScrollBoxListener']),
    /**
     * 监听滚动事件
     * @param  {Event} event
     */
    scrollBoxListener(event) {
      // 滚动盒子滚动到的位置
      let scrollTop = event.target.scrollTop;
      // 判断当前页面显示的内容所属的标题的索引
      this.focusingHeadIndex = this.headElmInitialRects.findIndex((hElm, index, hElms) => {
        // 如果当前head的top小于或等于滚动盒子滚动到的位置, 减1主要因为a元素锚点定位不精确到小数，有时元素的scrollTop是带小数的
        if ((hElm.top - 1) <= scrollTop) {
          // 是不是已经判断到最后一个head元素
          if ((hElms.length - 1) === index) {
            return true;
          } else {
            // 判断是否还未滚动达下一个head的高度
            return (hElms[index + 1].top - 1) > scrollTop;
          }
        }
      });
    },
    /**
     * 获取目录项的class
     * @param  {Object} li 目录项数据
     * @param  {number} index 目录项索引
     * @return {string} class
     */
    getCatalogItemClass(li, index) {
      // 如果该项是正在屏幕显示的部分
      if (index === this.focusingHeadIndex) {
        return `level-${li.level} focusing`;
      } else {
        return `level-${li.level}`;
      }
    },
    /**
     * 获取文章数据
     */
    fetchPost() {
      this.state = LOADING;
      this.$api.posts
        .getByID(this.$route.params.id)
        .then(resData => {
          this.post = resData.data;
          this.state = FINISH;
        })
        .catch(e => {
          this.state = ERROR;
        });
    },
    /**
     * 将markdown转为innerHTML
     * @param  {string} mdText
     * @return {string} innerHTML
     */
    convertToInnerHTML(mdText) {
      let renderer = new marked.Renderer();
      // 设置head元素处理函数
      renderer.heading = generateHeadingRender('heading');

      return marked(mdText, { headerIds: false, renderer });

      /**
       * 生成renderer.heading函数并返回
       * @param  {string} IDPrefix head元素id前缀
       * @return {Function} heading
       */
      function generateHeadingRender(IDPrefix) {
        let index = 0;

        return function(text, level) {
          return `<h${level} id="${IDPrefix}-${index++}">${text}</h${level}>`;
        };
      }
    }
  },
  watch: {
    // 获取到文章数据后需要做的事
    post(post) {
      // 处理时间戳
      post.updated_at = moment(post.updated_at).format('YYYY年M月D日 HH:mm:ss');
      // 文章数据初次作用到页面后处理
      this.$nextTick(() => {
        // 选择文章的所有标题元素
        let $heads = this.$refs.content.querySelectorAll('h1,h2,h3,h4,h5,h6');

        if (!$heads.length) return;

        [...$heads].forEach(hElm => {
          // 用标题元素的数据生成文章目录数据
          this.catalogList.push({
            level: hElm.tagName.slice(1),
            title: hElm.textContent,
            id: hElm.id
          });
          // 保存文章标题相对于页面顶部的初始位置
          this.headElmInitialRects.push(hElm.getBoundingClientRect());
        });
        this.throttledScrollListener = throttle(this.scrollBoxListener);
        // 监听滚动事件
        this.addScrollBoxListener(this.throttledScrollListener);
        // 目录数据初次作用到页面后处理
        this.$nextTick(() => {
          // 保存目录相对于页面顶部的初始位置
          this.catalogElmInitialRects = [...this.$refs.sideCatalog.children].map(li => {
            return li.getBoundingClientRect();
          });
        });
      });
    },
    /**
     * 如果正在显示的部分有变化，证明目录有变化，所以判断并调整目录窗口中目录项的显示
     * @param  {number} newIndex
     */
    focusingHeadIndex(newIndex) {
      // 窗口高度
      let windowHeight = window.innerHeight;
      // 如果索引合法
      if (newIndex >= 0) {
        // 当前显示的内容的目录项相对于窗口的位置
        let { top, bottom } = this.$refs.sideCatalog.children[newIndex].getBoundingClientRect();
        // 当前目录容器的滚动高度
        let containerTop = this.$refs.sideCatalogContainer.getBoundingClientRect().top;

        if (windowHeight < bottom || top < containerTop) {
          this.$refs.sideCatalogContainer.scrollTop = this.catalogElmInitialRects[newIndex].top - containerTop;
        }
      }
    }
  },
  created() {
    this.fetchPost();
  },
  beforeDestroy() {
    this.removeScrollBoxListener(this.throttledScrollListener);
  }
};
</script>

<style lang="scss">
.m-post {
  margin: 0 auto;
  max-width: 800px;
  .aside-catalog-wrap {
    position: sticky;
    position: fixed\0;
    top: 0;
    right: 0;
    .aside-catalog {
      position: absolute;
      right: -260px;
      right: 40px\0;
      width: 250px;
      background-color: #fff;
      overflow:hidden;
      .tt {
        padding: 10px;
        font-size: 2.2rem;
        line-height: 30px;
        border-bottom: 1px solid rgba(0, 0, 0, .1);
      }
      .ct-ctnr {
        position: relative;
        max-height: calc(100vh - 50px);
        width: 270px;
        padding: 10px 10px 5px 10px;
        overflow-x: hidden;
        overflow-y: auto;
        .ct {
          width: 220px;
        }
      }
    }
  }
  .ctnr {
    background-color: #fff;
    header {
      padding: 20px 15px 0 20px;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      h1 {
        font-size: 3rem;
        font-weight: 700;
        line-height: 40px;
      }
      .tags-ctnr {
        $height: 35px;
        padding: 5px 0;
        line-height: $height;
        .tag {
          display: inline-block;
          margin-right: 10px;
          padding: 0 15px;
          height: 25px;
          line-height: 25px;
          font-size: 1.4rem;
          border-radius: 2px;
          background-color: #ededed;
        }
      }
    }
    .catalog {
      display: none;
      padding: 15px 20px;
      .tt {
        font-size: 2.4rem;
        line-height: 30px;
      }
      .ct {
      }
    }
    >.ct {
      padding: 20px 25px;
    }
    >.other {
      padding: 15px 20px;
      font-size: 1.4rem;
      color: #888;
      span:not(:first-child){
        margin-left: 20px;
      }
    }
  }
  .statebar {
    width: 100%;
    height: 50px;
  }
  .catalog-list {
    $linkColor: rgb(75, 96, 121);
    $linkHoverColor: rgb(54, 141, 249);
    font-size: 1.6rem;
    padding-left: 10px;
    list-style-type: disc;
    word-wrap: break-word;
    word-break:break-all;
    hyphens: auto;
    li {
      line-height: 30px;
      color: $linkColor;
      a {
        text-decoration: none;
        color: inherit;
        cursor: inherit;
      }
      &:hover {
        color: $linkHoverColor;
        cursor: pointer;
      }
      &.focusing {
        font-weight: 700;
        color: $linkColor;
        cursor: initial;
      }
    }
    .level-1 {
      margin-left: 10px;
    }
    .level-2 {
      margin-left: 20px;
    }
    .level-3 {
      margin-left: 30px;
    }
    .level-4 {
      margin-left: 40px;
    }
    .level-5 {
      margin-left: 50px;
    }
    .level-6 {
      margin-left: 60px;
    }
  }
  .theme-dark & {
    color: #a1a1a1;
    .aside-catalog-wrap{
      .aside-catalog {
        background-color: #1e1e1e;
        .tt {
          border-bottom: 1px solid rgba(255, 255, 255, .1);
        }
      }
    }
    .ctnr {
      background-color: #1e1e1e;
      header {
        border-bottom-color: rgba(255, 255, 255, .1);
        .tags-ctnr {
          .tag {
            background-color: rgba(255, 255, 255, .3);
            color: #1e1e1e;
          }
        }
      }
    }
    .catalog-list {
      li.focusing {
        color: rgb(117, 135, 156);
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .m-post {
    .aside-catalog-wrap {
      display: none;
    }
    .ctnr{
      .catalog {
        display: block;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .m-post {
    .ctnr {
      header{
      padding: 15px 15px 0 15px;
      }
      .catalog{
        padding: 15px;
      }
      >.ct {
        padding: 15px 20px;
        // 移动端有头部，锚定的时候会定位到页面头部，而不是滚动窗口头部，所以设置这一项是为了解决这个问题
        h1, h2, h3, h4, h5, h6 {
          &::before {
            content: '';
            display: block;
            padding-top: 50px;
            margin-top: -50px;
          }
        }
      }
      >.other{
        padding: 15px;
      }
    }
  }
}
</style>
