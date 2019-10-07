/**
 * markdown编辑模块主组件
 */

<template>
  <div class="m-md" :class="modeClass" @click="resetState">
    <div class="md-ctnr">
      <div class="tool">
        <div class="shortcut-ctnr" ref="shortcutCtnr">
          <ShortCut
            @show-select-table="showSelectTable"
            @update-range="updateRange"
            @processing="handleShortcut"
          ></ShortCut>
        </div>
        <div class="btns-fixed">
          <div @click="switchMode">
            <i class="icon" :class="modeIconClass"></i>
          </div>
        </div>
      </div>
      <div class="md-ct">
        <div class="edit">
          <div class="edit-wrap">
            <!-- 监听keyup事件是为了兼容ie10 -->
            <div
              id="edit-ct"
              contenteditable="true"
              @input="freshPreview"
              @keyup="freshPreview"
              ref="editContainer"
              @paste.prevent="handlePaste"
            >
              <div
                v-for="(inlineText, index) in initialInlineTexts"
                :key="index"
                v-html="inlineText.trim() ? inlineText : '<br>'"
              ></div>
            </div>
          </div>
        </div>
        <div class="preview" ref="preview">
          <div
            class="ct markdown-body"
            ref="previewContainer"
            v-html="previewHTML"
          ></div>
        </div>
      </div>
    </div>
    <SelectTable
      :selected-tab="selectedTab"
      :initial-title="selectedSnippet"
      @insert="insertResources"
      @close="closeSelectTable"
    ></SelectTable>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import marked from 'marked';
import SelectTable from './SelectTable';
import ShortCut from './Shortcut';
import shortcutHandler from './shortcutHandler';

const [EDITING, PREVIEW] = [0, 1];

export default {
  name: 'Markdown',
  components: { SelectTable, ShortCut },
  props: {
    // 内容
    content: {
      type: String
    }
  },
  data() {
    return {
      // 初始内容inlineText集
      initialInlineTexts: this.content.split('\n'),
      // 最新的内容
      curContent: this.content,
      // 操作和获取选区信息的对象
      range: null,
      // 选择框
      selectedTab: false,
      // 内容区显示模式，移动端用，屏幕小的时候只会显示编辑页或者预览页
      mode: EDITING,
      // 选择的本地图片
      images: []
    };
  },
  computed: {
    /**
     * 由内容转化后的innerHTML
     * @return {string}
     */
    previewHTML() {
      return marked(this.curContent);
    },
    /**
     * 组件模式class
     * @return {string}
     */
    modeClass() {
      return this.mode === EDITING ? 'mode-editing' : 'mode-preview';
    },
    /**
     * 组件模式图标class
     * @return {string}
     */
    modeIconClass() {
      return this.mode === EDITING ? 'iconeye' : 'iconpen';
    },
    /**
     * 选中的文本片断
     * @return {string}
     */
    selectedSnippet() {
      return this.range ? this.range.toString() : '';
    }
  },
  methods: {
    /**
     * 初始化滚动
     */
    _initScroll() {
      this._toolBarScroll = new BScroll(this.$refs.shortcutCtnr, {
        click: true,
        scrollX: true,
        scrollY: false
      });
      this._previewCtScroll = new BScroll(this.$refs.preview, {
        click: true,
        mouseWheel: true
      });
    },
    /**
     * 更新表示选中文本的对象
     */
    updateRange() {
      try {
        let range = window.getSelection().getRangeAt(0);
        // 判断选中的文本是否在编辑区域中
        if (inEditContainer(range.startContainer)) {
          this.range = range;
        } else {
          this.range = null;
        }
      } catch (e) {
        this.range = null;
      }

      function inEditContainer(node) {
        // console.log(node);
        if (node.nodeType === 1 && node.parentNode.id === 'edit-ct') {
          return true;
        } else {
          // console.log(node.parentNode);
          if (!node.parentNode) {
            return false;
          } else {
            return inEditContainer(node.parentNode);
          }
        }
      }
    },
    /**
     * 刷新预览区
     */
    freshPreview() {
      let divLength = this.$refs.editContainer.querySelectorAll('div').length;
      // 如果输入区域没有行的话则插入一行
      if (divLength === 0) {
        this.$refs.editContainer.innerHTML = '<div><br></div>';
      }

      this.curContent = this.$refs.editContainer.innerText;
    },
    /**
     * 插入本地资源
     * @param  {string} type
     * @param  {Object} data 数据
     * @param  {Object} fileData 文件数据
     */
    insertResources(type, data, fileData) {
      if (type === 'image' && fileData) {
        this.images.push(fileData);
      }

      this.handleShortcut(type, data);
    },
    /**
     * 显示选择窗口组件
     * @param  {string} tabType
     */
    showSelectTable(tabType) {
      if (
        this.range === null ||
        this.range.startContainer !== this.range.endContainer
      ) {
        return;
      }

      this.selectedTab = tabType;
    },
    /**
     * 关闭选择窗口组件
     * @param  {string} tabType
     */
    closeSelectTable() {
      this.selectedTab = '';
    },
    /**
     * 处理快捷方式
     * @param  {string} type
     * @param  {Object} attr 数据
     */
    handleShortcut(type, attr) {
      // 没有选中编辑区中的文本或者光标在编辑区中，则不处理
      if (this.range === null) return;

      let options = {
        range: this.range,
        container: this.$refs.editContainer,
        attr
      };

      shortcutHandler.handle(type, options);

      this.freshPreview();
      this.resetState();
    },
    /**
     * 处理粘贴事件
     * @param  {Event} event 事件对象
     */
    handlePaste(event) {
      this.updateRange();
      // 获取剪切板数据对象
      let clipboardData = event.clipboardData || window.clipboardData;
      // 获取要粘贴的文字并分行为数组，供后续处理
      let lines = clipboardData.getData('text').split('\n');

      if (lines.length === 1) {
        this.handleShortcut('paste-inline', { insertion: lines[0] });
      } else if (lines.length) {
        this.handleShortcut('paste-line', { lines });
      }
    },
    /**
     * 切换组件模式，移动端使用
     * @return {[type]}
     */
    switchMode() {
      this.mode = this.mode === EDITING ? PREVIEW : EDITING;
    },
    /**
     * 过滤无用、重复的图片
     */
    filterImages() {
      // 图片去重
      this.images = this.images.reduce((images, next) => {
        let image = images.find(
          image => image.name === next.name && image.url === next.url
        );

        if (!image) {
          images.push(next);
        }

        return images;
      }, []);

      // 去除内容中没有引用的本地图片
      for (let i = this.images.length - 1; i >= 0; i--) {
        if (!this.curContent.includes(this.images[i].url)) {
          this.images.splice(i, 1);
        }
      }
    },
    /**
     * 生成文件表格，以便上传服务端
     * @return {FormData}
     */
    generateImgsForm() {
      let formData = new FormData();
      let info = [];

      if (!this.images.length) return null;

      this.images.forEach((file, index) => {
        let { data, name, title } = file;
        // 加入到图片信息的数组里，供服务端查看详细数据，做相应的处理
        info.push({
          filename: name,
          title
        });

        formData.set(`image${index}`, data, name);
      });

      formData.set('info', JSON.stringify(info));

      return formData;
    },
    /**
     * 使用服务端返回的图片存放信息替换内容中的本地图片链接
     * @param  {Object} imageInfo
     */
    replaceImageSRC(imageInfo) {
      // 匹配在正则表达式中有特殊作用的符号，主要是用来消除以任何字符串生成的正则表达式中的歧义
      let escapeRE = /([\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/])/g;

      imageInfo.forEach(image => {
        // 找到与服务端图片信息相同图片名的图片文件
        let file = this.images.find(file => file.name === image.filename);
        // 生成正则表达式字符串
        let REString = file.url.replace(escapeRE, '\\$1');
        // 创建该图片链接的正则表达式
        let SRC_RE = new RegExp(REString, 'g');
        // 把内容中的本地图片地址替换成已经上传的服务端图片地址
        this.curContent = this.curContent.replace(SRC_RE, image.src);
      });
    },
    /**
     * 上传图片到服务端及替换本地图片文件链接
     * @return {Promise}
     */
    uploadImagesAndReplace() {
      return new Promise((resolve, reject) => {
        // 过滤无用、重复的图片
        this.filterImages();
        // 生成图片的FormData表格
        let formData = this.generateImgsForm();

        if (formData) {
          // 上传图片
          this.$api.images.upload(formData).then(resData => {
            // 使用服务端返回的图片存放信息替换内容中的本地图片链接
            this.replaceImageSRC(resData.data);
            resolve();
          });
        } else {
          // 没有图片则直接进入下一步
          resolve();
        }
      });
    },
    /**
     * 重置各子组件状态
     */
    resetState() {
      this.closeSelectTable();
    },
    /**
     * 获得内容，主要供父组件调用
     * @return {Pormise}
     */
    getContent() {
      return this.uploadImagesAndReplace().then(res => {
        return this.curContent;
      });
    }
  },
  mounted() {
    this._initScroll();
  }
};
</script>

<style lang="scss">

.m-md {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .md-ctnr {
    $border_style: 1px solid rgb(226, 229, 236);
    width: 100%;
    height: 100%;
    overflow: hidden;
    .tool {
      $height: 40px;
      position: relative;
      height: $height;
      padding: 0 10px;
      border-bottom: $border_style;
      line-height: $height;
      background-color: #fdfdfd;
      z-index: 1;
      .shortcut-ctnr {
        height: $height;
      }
      .btns-fixed {
        display: none;
        position: absolute;
        right: 0;
        top: 0;
        width: $height;
        height: $height - 1px;
        line-height: $height;
        text-align: center;
        background-color: #fff;
        .mode-editing,
        .mode-preview {
          $height: $height - 10px;
          display: inline-block;
          width: $height;
          line-height: $height;
          vertical-align: middle;
        }
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 1px;
          height: 30px;
          left: 0;
          top: 5px;
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
    .md-ct {
      position: relative;
      height: calc(100% - 40px);
      font-size: 0;
      overflow: hidden;
      .edit,
      .preview {
        display: inline-block;
        width: 50%;
        height: 100%;
        font-size: 1.4rem;
        overflow: hidden;
      }
      .edit {
        position: relative;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.02);
        overflow: hidden;
        .edit-wrap {
          position: absolute;
          left: 0;
          top: 0;
          width: calc(100% + 18px);
          height: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          #edit-ct {
            width: 100%;
            min-height: 100%;
            outline: none;
            color: #555;
            padding: 0 15px;
            > div {
              min-height: 30px;
              line-height: 30px;
            }
          }
        }
      }
      .preview {
        height: 100%;
        padding: 0 20px;
        overflow: hidden;
        border-left: $border_style;
        background-color: #fff;
        .ct {
          width: 100%;
        }
      }
    }
  }
  .theme-dark & {
    background-color: #1e1e1e;
    color: #a1a1a1;
    .md-ctnr {
      .tool {
        border-color: rgba(255, 255, 255, 0.06);
        background-color: #191919;
        .btns-fixed {
          background-color: #1e1e1e;
          &::before {
            background-color: rgba(255, 255, 255, 0.05);
          }
        }
      }
      .md-ct {
        .edit {
          background-color: rgba(0, 0, 0, 0.1);
          .edit-wrap {
            #edit-ct {
              color: #888;
            }
          }
        }
        .preview {
          border-color: rgba(255, 255, 255, 0.06);
          background-color: #1e1e1e;
        }
      }
    }
  }
  @media screen and (max-width: 768px) {
    &.mode-editing {
      .md-ctnr {
        .md-ct {
          .edit {
            width: 100%;
          }
          .preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            transform: translate3d(100%, 0, 0);
          }
        }
      }
    }
    &.mode-preview {
      .md-ctnr {
        .md-ct {
          .edit {
            width: 100%;
          }
          .preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border-left: 0;
          }
        }
      }
    }
    .md-ctnr {
      .tool {
        padding: 0 40px 0 10px;
        .btns-fixed {
          display: block;
        }
      }
    }
  }
}

</style>
