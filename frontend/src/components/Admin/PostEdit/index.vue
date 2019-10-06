/**
 * 文章编辑组件
 */

<template>
  <div class="m-postedit">
    <div v-if="isFinish" class="postedit-ctnr">
      <header>
        {{ pageTitle }}<i class="icon iconmore" @click="switchSideBar"></i>
      </header>
      <div class="postedit-ct">
        <!-- 组件主体 -->
        <div class="postedit-mn">
          <!-- 文章标题 -->
          <p class="post-tt">
            <input
              class="u-ipt-text1"
              type="text"
              name="title"
              v-model="post.title"
              placeholder="标题"
              autocomplete="off"
            />
          </p>
          <!-- 文章命名链接 -->
          <label class="post-namelink">
            http://yourwebsite/posts/
            <div class="wrap">
              <input
                class="u-ipt-text1"
                type="text"
                name="nameLink"
                placeholder="命名链接"
                autocomplete="off"
                v-model="post.namedLink"
              />
            </div>
          </label>
          <!-- 文章内容 -->
          <div class="markdown-ctnr">
            <Markdown :content="post.content" ref="md"></Markdown>
          </div>
        </div>
        <!-- 组件侧边栏 -->
        <div
          class="postedit-extends"
          :class="{ mobile__show: sideBarState }"
          ref="extends"
        >
          <div class="extends-ctnr">
            <!-- 文章提交按钮 -->
            <div class="btns">
              <ButtonState
                v-for="(btn, idx) in submitBtns"
                :key="idx"
                class="btn"
                :state="btn.state"
                @click="submit(btn);"
                >{{ btn.title }}</ButtonState>
            </div>
            <!-- 文章封面 -->
            <div class="cover-ctnr">
              <Cover :post-cover="post.cover" ref="cover"></Cover>
            </div>
            <!-- 文章标签 -->
            <div class="tags-ctnr">
              <Tags :post-tags="post.tags" ref="tag"></Tags>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BarState class="statebar" :state="state"></BarState>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Markdown from 'components/common/Markdown';
import Cover from './Cover';
import Tags from './Tags';
import BScroll from 'better-scroll';
import { checkPostFormat } from 'common/scripts/check';
import { isType, isSomeType } from 'common/scripts/utils';

const [LOADING, ERROR, FINISH] = ['loading', 'error', 'finish'];
const [CREATING, MODIFYING] = ['creating', 'modifying'];

export default {
  name: 'PostEdit',
  components: { Markdown, Tags, Cover },
  data() {
    return {
      // 编辑模式，“创建” 或者 “修改”
      mode: null,
      // 文章数据模板
      post: {
        _id: '',
        title: '',
        namedLink: '',
        content: '',
        cover: '',
        describe: '',
        tags: []
      },
      // 文章加载状态
      state: LOADING,
      // 移动端侧边栏模式
      sideBarState: false,
      // 提交按钮
      submitBtns: [
        {
          state: FINISH,
          // 文章保存到草稿箱
          postToState: 'editing',
          title: '保存为草稿'
        },
        {
          state: FINISH,
          // 文章发布
          postToState: 'published',
          title: '发布文章'
        }
      ]
    };
  },
  computed: {
    pageTitle() {
      if (this.post.state === 'published') {
        return '编辑文章';
      } else if (this.post.state === 'editing') {
        return '编辑草稿';
      } else {
        return '新建文章';
      }
    },
    isFinish() {
      return this.state === FINISH;
    }
  },
  methods: {
    ...mapActions('admin', ['notify']),
    /**
     * 判断按钮提交是否完成
     * @param  {Object}  btn
     * @return {Boolean}
     */
    isFinishState(btn) {
      return btn.state === FINISH;
    },
    /**
     * 判断按钮是否在提交中
     * @param  {Object}  btn
     * @return {Boolean}
     */
    isLoadingState(btn) {
      return btn.state === LOADING;
    },
    /**
     * 初始化组件滚动
     */
    _initScroll() {
      this.extendsScroll = new BScroll(this.$refs.extends, {
        click: true,
        mouseWheel: true
      });
    },
    /**
     * 切换侧边栏显示(移动端使用)
     */
    switchSideBar() {
      this.sideBarState = !this.sideBarState;
    },
    /**
     * 批量改变按钮集的状态
     * @param  {Array} btns 按钮集
     * @param  {Object} clickedBtn 点击的按钮
     */
    changeBtnState(btns, clickedBtn) {
      const [BTN_LOADING, BTN_DISABLED, BTN_FINISH] = ['loading', 'disabled', 'finish'];

      btns.forEach(btn => {
        if (clickedBtn) {
          clickedBtn.state = BTN_LOADING;
          btns.forEach(btn => {
            if (btn !== clickedBtn) {
              btn.state = BTN_DISABLED;
            }
          });
        } else {
          btns.forEach(btn => {
            btn.state = BTN_FINISH;
          });
        }
      });
    },
    /**
     * 提交文章
     * @param  {Object} btn 被点击的按钮
     */
    submit(btn) {
      btn.state = LOADING;
      this.changeBtnState(this.submitBtns, btn);

      // 从markdown编辑器组件获取文章内容
      this.$refs.md.getContent().then(content => {
        this.post.content = content;
        // 文章保存的状态
        this.post.state = btn.postToState;
        this.post.tags = this.$refs.tag.getTags();
        this.post.cover = this.$refs.cover.getCover();

        let formData = new FormData();
        // 添加字段到表格(FormData)
        Object.keys(this.post).forEach(key => {
          let val = this.post[key];

          if (key === 'cover' && val !== null) {
            formData.set(key, val, val.name);
          }

          if (isSomeType(val, ['Object', 'Array'])) {
            formData.set(key, JSON.stringify(val));
          } else {
            formData.set(key, val);
          }
        });

        // 检查文章文本格式
        let result = checkPostFormat(formData);
        // 如果格式不合格则不做进一步处理
        if (isType(result, 'Error')) {
          btn.state = FINISH;
          this.notify({ type: 'error', content: result.message });
          this.changeBtnState(this.submitBtns);
          return;
        }

        let promise;

        if (this.mode === CREATING) {
          promise = this.createPost(formData);
        } else {
          promise = this.updatePost(formData);
        }

        promise
          .then(resData => {
            this.notify({ type: 'success', content: resData.message });
            this.$router.back();

            this.changeBtnState(this.submitBtns);
          })
          .catch(e => {
            this.notify({ type: 'error', content: e.message });

            this.changeBtnState(this.submitBtns);
          });
      });
    },
    /**
     * 创建文章
     * @param  {FormData} formData
     * @return {Promise}
     */
    createPost(formData) {
      return this.$api.posts.create(formData);
    },
    /**
     * 修改文章
     * @param  {FormData} formData
     * @return {Promise}
     */
    updatePost(formData) {
      return this.$api.posts.update(formData);
    }
  },
  watch: {
    // 监听文章加载状态，判断是否可以开始初始化滚动
    state(val) {
      if (val === FINISH) {
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    }
  },
  created() {
    let id = this.$route.params.id;
    // 如果有id则判断为编辑文章，向服务端请求文章数据
    if (id) {
      // 组件设为文章编辑模式
      this.mode = MODIFYING;
      // 获取文章
      this.$api.posts
        .getByID(id, { pv: 0 })
        .then(resData => {
          Object.keys(this.post).forEach(key => {
            this.post[key] = resData.data[key];
          });
          // 组件加载完成
          this.state = FINISH;
        })
        .catch(e => {
          // 文章加载失败
          this.state = ERROR;
        });
    } else {
      // 组件设为文章创建模式
      this.mode = CREATING;
      // 组件加载完成
      this.state = FINISH;
    }
  }
};
</script>

<style lang="scss">
.m-postedit {
  position: relative;
  min-width: 300px;
  height: 100vh;
  padding: 20px;
  overflow: hidden;
  > .postedit-ctnr {
    width: 100%;
    height: 100%;
    background-color: #fff;
    > header {
      position: relative;
      height: 60px;
      line-height: 60px;
      padding: 0 10px;
      font-size: 1.7rem;
      font-weight: 100;
      border-bottom: 1px solid rgb(221, 221, 221);
      .icon {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 60px;
        text-align: center;
        cursor: pointer;
      }
    }
    > .postedit-ct {
      $sideBarWidth: 220px;
      $inputHeight: 36px;
      position: relative;
      height: calc(100% - 60px);
      width: 100%;
      padding: 0 10px;
      padding-right: $sideBarWidth;
      overflow: hidden;
      > .postedit-mn {
        position: relative;
        height: 100%;
        overflow: hidden;
        z-index: 1;
        .post-tt {
          margin: 15px 15px 0 15px;
          input {
            width: 100%;
            height: $inputHeight;
            padding: 0 10px;
          }
        }
        .post-namelink {
          $inputHeight: 35px;
          position: relative;
          display: block;
          margin: 10px 15px 0 15px;
          height: $inputHeight;
          font-size: 1.4rem;
          line-height: $inputHeight;
          color: #888;
          .wrap {
            position: absolute;
            display: block;
            left: 165px;
            right: 0;
            top: 0;
            width: calc(100% - 165px);
            height: $inputHeight;
            input {
              width: 100%;
              height: 100%;
              padding: 0 10px;
            }
          }
        }
        .markdown-ctnr {
          position: absolute;
          top: 110px;
          bottom: 15px;
          left: 15px;
          right: 15px;
          border: 1px solid #ddd;
          overflow: hidden;
        }
      }
      > .postedit-extends {
        position: absolute;
        right: 0;
        top: 0;
        width: $sideBarWidth;
        height: 100%;
        border-left: 1px solid #eee;
        background-color: #fff;
        z-index: 2;
        overflow: hidden;
        .extends-ctnr {
          padding: 15px;
          .btns {
            .btn {
              display: block;
              width: 100%;
              height: $inputHeight;
              line-height: $inputHeight;
            }
            .btn:not(:first-child) {
              margin-top: 10px;
            }
          }
          .cover-ctnr {
            margin-top: 25px;
          }
          .tags-ctnr {
            margin-top: 20px;
          }
        }
        &.mobile__show {
          box-shadow: -10px 0 20px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
  .statebar {
    width: 100%;
    height: 50px;
  }
  .theme-dark & .postedit-ctnr {
    background-color: #252525;
    color: #a1a1a1;
    header {
      border-color: rgba(255, 255, 255, 0.1);
    }
    .postedit-ct {
      .postedit-mn {
        .markdown-ctnr {
          border-color: rgba(255, 255, 255, 0.05);
        }
      }
      .postedit-extends {
        background-color: #252525;
        border-color: rgba(255, 255, 255, 0.1);
        &.mobile__show {
          box-shadow: -10px 0 20px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    height: calc(100vh - 50px);
    .postedit-ctnr {
      header {
        .icon {
          display: block;
        }
      }
      .postedit-ct {
        padding-right: 10px;
        .postedit-extends {
          transform: translate3d(100%, 0, 0);
          &.mobile__show {
            transform: translate3d(0, 0, 0);
          }
        }
      }
    }
  }
}
</style>
