/** * 数组表格组件 */

<template>
  <div class="m-datatable">
    <!-- 工具条 -->
    <div class="tool">
      <!-- 筛选搜索框 -->
      <label class="filter">
        <span class="tt">筛选：</span>
        <input
          class="u-ipt-text1"
          type="text"
          v-model="filterVal"
          autocomplete="off"
        />
        <i
          class="btn-clean icon iconclose"
          v-show="filterVal"
          @click="filterVal = '';"
        ></i>
      </label>
      <!-- 行数 -->
      <div class="line-count" ref="options">
        <span class="tt">行数：</span>
        <div class="options-ctnr" @click.stop="switchLineCountOptions">
          <div class="cur-count">
            <span>{{ lineCount.cur }}</span> <i class="icon iconarrowdown"></i>
          </div>
          <ul class="options" v-show="lineCount.optionShow">
            <li
              v-for="count in lineCount.options"
              :key="count"
              :class="{ selected: count === lineCount.cur }"
              @click="setLineCount(count);"
            >
              {{ count }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 数据表格 -->
    <div class="table f-scrollbar-decor" ref="table">
      <table class="table-ct">
        <thead>
          <tr>
            <th v-for="(val, attr) in source.heads" :key="attr" :class="attr">
              {{ val }}
              <!-- 排序icon -->
              <div class="sort">
                <i
                  class="icon iconarrowup"
                  @click="ascending(attr);"
                  :class="{ selected: isAscendingAttr(attr) }"
                ></i>
                <i
                  class="icon iconarrowdown"
                  @click="descending(attr);"
                  :class="{ selected: isDescendingAttr(attr) }"
                ></i>
              </div>
            </th>
            <th v-if="source.control.length" class="ctrl">选项</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, itemIndex) in displayedData" :key="itemIndex">
            <td v-for="(val, key) in source.heads" :key="key">
              {{ getAttrVal(item, key) }}
            </td>
            <!-- 列表项控制选项 -->
            <td class="ctrl">
              <i
                class="icon iconmenu2"
                @click.stop="switchItemMenu(itemIndex);"
              ></i>
              <!-- 选项列表 -->
              <ul
                v-show="ctrlMenu.showingItemIndex === itemIndex"
                :class="ctrlMenuStateClass(itemIndex)"
              >
                <li
                  v-for="(option, index) in source.control"
                  :key="index"
                  @click="$emit(option.event, item);"
                >
                  <i class="icon" :class="option.icon"></i> {{ option.title }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <BarTip class="tip" v-if="!source.posts.length">无数据</BarTip>
    </div>
    <!-- 页码选项条 -->
    <div class="pagebar">
      <ul class="btns">
        <li @click="backToPreviousPage" :class="previousPageBtnStateClass">
          <i class="icon iconarrowleft"></i>
        </li>
        <li
          v-for="num in pageCount"
          :key="num"
          :class="{
            item: curPage !== num,
            item__selected: curPage === num
          }"
          @click="curPage = num;"
        >
          {{ num }}
        </li>
        <li @click="goToNextPage" :class="nextPageBtnStateClass">
          <i class="icon iconarrowright1"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const [MENU_UP, MENU_DOWN] = [0, 1];

export default {
  name: 'DataTable',
  props: {
    // 列表数据资源
    source: {
      type: Object
    }
  },
  data() {
    return {
      // 当前页数
      curPage: 1,
      // 筛选器中输入的值
      filterVal: '',
      // 每页列表项的行数
      lineCount: {
        // 当前行数
        cur: 5,
        // 行数选项
        options: [5, 10, 15, 20],
        // 行数选项框的状态
        optionShow: false
      },
      // 排列属性
      sortAttr: {
        // 属性名
        name: null,
        // 属性的升降序
        direction: null
      },
      // 列表项控制菜单
      ctrlMenu: {
        // 正在显示menu的列表项索引，用于定位及显示menu
        showingItemIndex: null,
        // 显示位置偏上或偏下
        direction: null
      },
      noData: false
    };
  },
  computed: {
    /**
     * “上一页”按钮的状态class
     * @return {[type]}
     */
    previousPageBtnStateClass() {
      return this.curPage === 1 ? 'prev__disabled' : 'prev';
    },
    /**
     * “下一页”按钮的状态class
     * @return {[type]}
     */
    nextPageBtnStateClass() {
      return this.curPage === this.pageCount ? 'next__disabled' : 'next';
    },
    /**
     * 当前列表显示数据在总列表集时的起始位置
     * @return {number}
     */
    offsetIndex() {
      return (this.curPage - 1) * this.lineCount.cur;
    },
    /**
     * 经由关键字筛选过后的列表集
     * @return {Array}
     */
    filteredData() {
      if (this.filterVal === '') {
        return this.source.posts.slice(0);
      } else {
        return this.source.posts.filter((post, index) => {
          // 判断post属性中是否有任何一项包含了该关键词
          return Object.keys(this.source.heads).some(prop => {
            let postString = post[prop].toString().toLowerCase();
            return postString.indexOf(this.filterVal.toLowerCase()) !== -1;
          });
        });
      }
    },
    /**
     * 当前页数显示的数据
     * @return {Array}
     */
    displayedData() {
      return this.filteredData.slice(
        this.offsetIndex,
        this.offsetIndex + this.lineCount.cur
      );
    },
    /**
     * 页数
     * @return {number}
     */
    pageCount() {
      return Math.ceil(this.filteredData.length / this.lineCount.cur);
    }
  },
  methods: {
    /**
     * 控制选项框的状态class
     * @param  {string} itemIndex
     * @return {string} class
     */
    ctrlMenuStateClass(itemIndex) {
      if (this.ctrlMenu.showingItemIndex === itemIndex) {
        if (this.ctrlMenu.direction === MENU_UP) {
          return 'item-menu__up';
        } else {
          return 'item-menu__down';
        }
      } else {
        return 'item-menu';
      }
    },
    /**
     * 排序方式是否为该属性的升序
     * @param  {string}  attr
     * @return {Boolean}
     */
    isAscendingAttr(attr) {
      return this.isSortAttr(attr, 'ascending');
    },
    /**
     * 排序方式是否为该属性的降序
     * @param  {string}  attr
     * @return {Boolean}
     */
    isDescendingAttr(attr) {
      return this.isSortAttr(attr, 'descending');
    },
    /**
     * 判断排序属性及方向
     * @param  {string}  attr
     * @return {Boolean}
     */
    isSortAttr(attr, direction) {
      let isDirection = this.sortAttr.direction === direction;
      let isAttr = attr === this.sortAttr.name;
      return isDirection && isAttr;
    },
    /**
     * 切换页显示行数选项框的显示
     */
    switchLineCountOptions() {
      this.lineCount.optionShow = !this.lineCount.optionShow;
    },
    /**
     * 关闭列表项的菜单选项框
     */
    closeItemMenu() {
      this.lineCount.optionShow = false;
      this.ctrlMenu.showingItemIndex = null;
    },
    /**
     * 设置每页显示数据的行数
     * @param {number} count 行数
     */
    setLineCount(count) {
      this.lineCount.cur = count;
      // 当面显示页面切换到第一页
      this.curPage = 1;
    },
    /**
     * 切换列表项菜单选项框的显示
     * @param  {number} index 某列表项的索引
     */
    switchItemMenu(index) {
      // 如果之前的列表项的索引与最新的相同，则视为关闭该列表项
      if (this.ctrlMenu.showingItemIndex === index) {
        this.ctrlMenu.showingItemIndex = null;
      } else {
        let offset = this.displayedData.length - index;

        this.ctrlMenu.showingItemIndex = index;
        this.ctrlMenu.direction = offset <= 2 ? MENU_UP : MENU_DOWN;
      }
    },
    /**
     * 获得某个属性的值
     * @param  {Object} data
     * @param  {string} attr
     * @return {[type]}
     */
    getAttrVal(data, attr) {
      // author属性值是一个对象，需要判断一下取得name值
      return attr === 'author' ? data[attr].name : data[attr];
    },
    /**
     * 升序
     * @param  {string} attr
     */
    ascending(attr) {
      // 更新一下排序值
      this.sortAttr.name = attr;
      this.sortAttr.direction = 'ascending';
      // 排序
      this.source.posts.sort(function(a, b) {
        if (attr === 'pv') {
          return a[attr] - b[attr];
        } else if (a[attr] < b[attr]) {
          return -1;
        } else if (a[attr] > b[attr]) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    /**
     * 降序
     * @param  {string} attr
     */
    descending(attr) {
      // 更新一下排序值
      this.sortAttr.name = attr;
      this.sortAttr.direction = 'descending';
      // 排序
      this.source.posts.sort(function(a, b) {
        if (attr === 'pv') {
          return b[attr] - a[attr];
        } else if (a[attr] > b[attr]) {
          return -1;
        } else if (a[attr] < b[attr]) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    /**
     * 列表项上一页
     */
    backToPreviousPage() {
      this.curPage > 1 && (this.curPage -= 1);
    },
    /**
     * 列表项下一页
     */
    goToNextPage() {
      this.curPage < this.pageCount && (this.curPage += 1);
    }
  },
  mounted() {
    window.document.body.addEventListener('click', this.closeItemMenu);
  },
  destroyed() {
    window.document.body.removeEventListener('click', this.closeItemMenu);
  }
};
</script>

<style lang="scss">
$borderStyle: 1px solid rgb(221, 221, 221);

.m-datatable {
  width: 100%;
  font-size: 1.4rem;
  .tool {
    $height: 36px;
    $padding: 20px;
    $filterWdith: 260px;
    $optionsWdith: 130px;
    $toolItemTotalWidth: $filterWdith + $optionsWdith + $padding * 2 + 40px; // 40px是最外层的padding
    width: 300px;
    padding: 20px;
    width: 100%;
    .filter {
      display: inline-block;
      position: relative;
      width: $filterWdith;
      height: $height;
      padding-left: 50px;
      line-height: $height;
      font-size: 1.3rem;
      .tt {
        position: absolute;
        height: $height;
        left: 0;
        top: 0;
        text-align: center;
      }
      input {
        padding: 0 50px 0 10px;
        width: 100%;
        height: 100%;
      }
      input:focus + .btn-clean {
        display: block;
      }
      .btn-clean {
        position: absolute;
        right: 0;
        top: 0;
        width: $height;
        height: $height;
        line-height: $height;
        transform: scale(0.6);
      }
      &:hover .btn-clean {
        display: block;
      }
    }
    .line-count {
      float: right;
      position: relative;
      width: $optionsWdith;
      height: $height;
      padding-left: 50px;
      line-height: $height;
      .tt {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 1.3rem;
      }
      .options-ctnr {
        display: inline-block;
        position: relative;
        width: 100%;
        border: 1px solid rgb(221, 221, 221);
        border-radius: 3px;
        .cur-count {
          padding: 0 10px 0 15px;
          .icon {
            float: right;
            transform: scale(0.6);
          }
        }
        .options {
          position: absolute;
          padding: 5px 0;
          width: 100%;
          left: 0;
          top: 100%;
          background-color: #fff;
          color: #666;
          border-radius: 0 0 3px 3px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          z-index: 1;
          li {
            padding: 0 10px 0 15px;
            &:hover {
              background-color: rgba(0, 0, 0, 0.1);
            }
            &.selected {
              background-color: rgb(33, 150, 243);
              color: #fff;
            }
          }
        }
      }
    }
    @media screen and (max-width: $toolItemTotalWidth) {
      padding: 20px 14px;
      .filter {
        width: 100%;
      }
      .line-count {
        float: initial;
        margin-top: 10px;
      }
    }
  }
  .table {
    width: 100%;
    overflow-x: auto;
    .table-ct {
      min-width: 100%;
      border-collapse: collapse;
      th,
      td {
        padding: 10px 20px;
        vertical-align: middle;
        font-size: 1.3rem;
        text-align: left;
        line-height: 18px;
      }
      thead {
        tr {
          font-weight: 600;
          border-top: $borderStyle;
        }
        th {
          position: relative;
          min-width: 110px;
          line-height: 23px;
          vertical-align: middle;
          .sort {
            float: right;
            display: inline-block;
            color: #ddd;
            .icon {
              display: block;
              width: 10px;
              height: 10px;
              font-size: 1.2rem;
              line-height: 12px;
              transform: scale(0.7);
              cursor: pointer;
              &:hover {
                color: #555;
              }
              &.selected {
                color: #555;
              }
            }
          }
          &.title {
            min-width: 250px;
          }
          &.ctrl {
            min-width: 70px;
          }
        }
      }
      tbody {
        border-width: 1px 0 1px 0;
        border-style: solid;
        border-color: rgba(0, 0, 0, .15);
        tr {
          &:not(:last-child) {
            border-bottom: $borderStyle;
          }
          &:hover {
            background-color: rgba(0, 0, 0, 0.03);
          }
        }
        td.ctrl {
          position: relative;
          text-align: center;
          font-size: 1.7rem;
          .icon {
            cursor: pointer;
          }
          .item-menu,
          .item-menu__up,
          .item-menu__down {
            position: absolute;
            right: 70%;
            padding: 5px 0;
            width: 120px;
            background-color: #fff;
            color: rgb(51, 51, 51);
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
            font-size: 1.3rem;
            text-align: left;
            white-space: nowrap;
            z-index: 1;
            li {
              padding: 10px 16px;
              i {
                display: inline-block;
                margin-right: 5px;
              }
              &:hover {
                background-color: rgba(0, 0, 0, 0.1);
              }
            }
          }
          .item-menu__up {
            bottom: 50%;
          }
          .item-menu__down {
            top: 50%;
          }
        }
      }
    }
    .tip {
      width: 100%;
      height: 50px;
    }
  }
  .pagebar {
    padding: 14px 20px;
    overflow: hidden;
    .btns {
      $height: 34px;
      display: inline-block;
      float: right;
      height: $height;
      font-size: 0;
      > li {
        display: inline-block;
        width: $height;
        height: $height;
        border-radius: 3px;
        font-size: 1.4rem;
        line-height: $height;
        text-align: center;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 10px;
        }
      }
      .item {
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      .item__selected {
        background-color: #37474f;
        color: #fff;
      }
      .prev__disabled,
      .next__disabled {
        color: #aaa;
        cursor: default;
        &:hover {
          background-color: inherit;
        }
      }
    }
  }
  .theme-dark & {
    .tool .line-count .options-ctnr {
      border-color: rgba(255, 255, 255, 0.1);
      .options {
        background-color: #333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        color: #999;
        li.selected {
          background-color: #0b63aa;
        }
      }
    }
    .table {
      .table-ct {
        tbody {
          border-color: rgba(255, 255, 255, 0.1);
          .ctrl {
            .item-menu__up,
            .item-menu__down {
              background-color: #252525;
              color: #a1a1a1;
            }
          }
        }
        thead tr,
        tbody tr {
          border-color: rgba(255, 255, 255, 0.1);
        }
        thead th {
          .sort {
            color: #555;
            .icon {
              &:hover,
              &.selected {
                color: #ddd;
              }
            }
          }
        }
      }
    }
  }
}
</style>
