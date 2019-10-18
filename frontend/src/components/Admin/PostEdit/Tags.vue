/**
 * 文章标签选择组件
 */

<template>
  <div class="tags">
    <h3 class="tt">标签</h3>
    <!-- 选中的标签的容器 -->
    <div class="checked-tag-ctnr">
      <span class="tag u-tag1__checked" v-for="tag in checkedTags" :key="tag">
        {{ tag
        }}<i class="btn-delete icon iconclose" @click="uncheckTag(tag);"></i>
      </span>
    </div>
    <!-- 搜索框容器 -->
    <div class="sch" @click.stop>
      <!-- 搜索框 -->
      <input
        class="u-ipt-text1"
        v-model="searchInput"
        @input= "searchResult"
        @click.stop
        type="text"
        placeholder="搜索标签"
        autocomplete="off"
      />
      <!-- 提示框 -->
      <div class="msg" v-show="IllegalInput">
        标签名称不能包含下列字符 \ / ' " # : * ? &lt; &gt; | 空格
      </div>
      <!-- 搜索结果 -->
      <div class="result" v-show="resultShow">
        <!-- 无搜索结果时显示的增加标签按钮 -->
        <p class="btn-add" v-show="!containSameTag" @click="addTag">
          <i class="icon iconplus1"></i>添加 '{{ searchInput }}'
        </p>
        <!-- 匹配的标签 -->
        <div class="matched-tags" ref="martchedTags">
          <ul class="ct">
            <li
              v-for="tag in matchedTags"
              :key="tag.name"
              :class="generateTagClass(tag)"
              @click="toggleTag(tag);"
            >
              {{ tag.name }}
              <i class="icon iconplus1"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { mapActions } from 'vuex';

const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'Tags',
  props: {
    // 文章已选择的标签集
    postTags: {
      type: Array
    }
  },
  data() {
    return {
      // 标签集
      tags: [],
      // 文章已选择的标签集，初始化时拷贝一份供后续修改
      checkedTags: [...this.postTags],
      // 搜索框的输入
      searchInput: '',
      // 输入状态，用于辅助判断是否显示搜索结果
      typing: false,
      // 组件加载状态
      state: LOADING
    };
  },
  computed: {
    /**
     * 搜索框文本是否不合格
     */
    IllegalInput() {
      let Pattern = /[\\\/'"#:\*\?\<\>\| ]/;
      return Pattern.test(this.searchInput);
    },
    /**
     * 是否搜索到与搜索框输入一样的标签（如果没有搜索到，添加标签的按钮就会显示）
     * @return {Boolean}
     */
    containSameTag() {
      // 搜索框没有文章则判定为是（添加标签按钮则不会显示）
      if (this.searchInput === '') return true;

      return this.tags.includes(this.searchInput);
    },
    /**
     * 匹配搜索的标签集
     * @return {Array}
     */
    matchedTags() {
      // 匹配搜索的标签集
      let matchedTags = this.tags.filter(
        tag => tag.indexOf(this.searchInput) !== -1
      );
      // 有状态（是否选中）的标签集
      let matced = matchedTags.map(matchedTag => {
        return {
          name: matchedTag,
          // 是否已经有选中过
          checked: this.checkedTags.includes(matchedTag)
        };
      });
      // 超过五个时只返回匹配的前五个
      return matced.slice(0, 5);
    },
    resultShow() {
      return this.typing && !this.IllegalInput;
    }
  },
  methods: {
    ...mapActions('admin', ['notify']),
    /**
     * 初始化事件监听
     */
    _initEvent() {
      window.document.body.addEventListener('click', this.bodyClickListenFn);
    },
    /**
     * 初始化滚动
     */
    _initScroll() {
      this.tagsResultScroll = new BScroll(this.$refs.martchedTags, {
        click: true,
        mouseWheel: true
      });
    },
    generateTagClass(tag) {
      return tag.checked ? 'tag__checked' : 'tag';
    },
    /**
     * body元素点击事件监听函数
     */
    bodyClickListenFn() {
      this.typing = false;
    },
    /**
     * 添加新的标签
     */
    addTag() {
      // 在标签集中添加新的标签
      this.tags.push(this.searchInput);
      // 在已选中的标签集中添加新的标签
      this.checkedTags.push(this.searchInput);
      // 清空输入框
      this.searchInput = '';
    },
    /**
     * 切换标签的选中状态
     * @param  {Object} tag
     */
    toggleTag(tag) {
      tag.checked ? this.uncheckTag(tag.name) : this.checkTag(tag.name);
    },
    /**
     * 取消选中标签
     * @param  {string} tagName
     */
    uncheckTag(tagName) {
      let index = this.checkedTags.indexOf(tagName);
      index !== -1 && this.checkedTags.splice(index, 1);
    },
    /**
     * 选中标签
     * @param  {string} tagName
     */
    checkTag(tagName) {
      let index = this.checkedTags.indexOf(tagName);
      index === -1 && this.checkedTags.push(tagName);
    },
    /**
     * 搜索框input事件监听函数
     */
    searchResult() {
      // 设置为正在输入状态
      this.typing = true;
    },
    /**
     * 获取选中的标签集，主要是给父组件获取选中标签集
     * @return {[type]}
     */
    getTags() {
      return this.checkedTags;
    }
  },
  watch: {
    // 监听组件加载状态
    state(newState) {
      if (newState === FINISH) {
        // 加载完成后初始化滚动
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    }
  },
  created() {
    this.state = LOADING;
    this.$api.tags
      .get()
      .then(resData => {
        // 返回的数据是对象，key为标签名
        this.tags = Object.keys(resData.data);
        // 组件加载状态设为完成
        this.state = FINISH;
      })
      .catch(e => {
        this.notify({ type: 'error', content: e.message });
        // 标签虽然加载不到，但不影响后续的添加，所以组件加载状态设为完成
        this.state = FINISH;
      });
  },
  mounted() {
    this._initEvent();
  },
  beforeDistory() {
    window.document.body.removeListener(this.bodyClickListenFn);
  }
};
</script>
<style lang="scss">
.tags {
  > .tt {
    font-size: 1.4rem;
    line-height: 30px;
  }
  .checked-tag-ctnr {
    min-height: 40px;
    padding-bottom: 3px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.05);
    .tag {
      margin: 5px 0 0 5px;
    }
  }
  .sch {
    margin-top: 8px;
    position: relative;
    width: 100%;
    > input {
      width: 100%;
      height: 32px;
      padding: 0 8px;
    }
    .msg {
      margin-top: 4px;
      padding: 10px;
      border-radius: 3px;
      line-height: 18px;
      border: 1px solid rgba(255, 0, 0, 0.3);
      background-color: rgba(255, 0, 0, 0.15);
      color: #666;
    }
    .result {
      display: block;
      position: absolute;
      left: 0;
      top: 100%;
      width: 100%;
      background-color: #fff;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
      z-index: 1;
      .btn-add {
        $itemHeight: 25px;
        padding: 10px;
        font-size: 1.4rem;
        line-height: $itemHeight;
        color: #666;
        cursor: pointer;
        .icon {
          margin-right: 10px;
          width: $itemHeight;
          height: $itemHeight;
          text-align: center;
          vertical-align: top;
          font-size: 1.4rem;
          &::before {
            line-height: $itemHeight;
          }
        }
      }
      .matched-tags {
        position: relative;
        width: 100%;
        max-height: 200px;
        color: #666;
        overflow: hidden;
        > .ct {
          padding: 10px 0;
          .tag,
          .tag__checked {
            $itemHeight: 25px;
            font-size: 1.4rem;
            padding: 0 10px 0 15px;
            line-height: $itemHeight;
            overflow: hidden;
            %icon {
              width: $itemHeight;
              height: $itemHeight;
              text-align: center;
              vertical-align: middle;
              &::before {
                line-height: $itemHeight;
              }
            }
            .icon {
              @extend %icon;
              float: right;
              font-size: 1.4rem;
            }
          }
          .tag {
            cursor: pointer;
            .icon {
              display: initial;
            }
          }
          .tag__checked {
            color: #aaa;
            .icon {
              display: none;
            }
          }
        }
      }
    }
  }
  .theme-dark & {
    .sch {
      .result {
        background-color: #2a2a2a;
        .btn-add {
          color: #a1a1a1;
        }
        .matched-tags {
          > .ct {
            .tag {
              color: #aaa;
            }
            .tag__checked {
              color: inherit;
            }
          }
        }
      }
    }
  }
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 200px;
    background-color: transparent;
  }
}
</style>
