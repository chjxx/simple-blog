/**
 * 快捷键工具条
 */

<template>
  <div
    class="shortcut"
    @mousedown="updateRange"
    @click.stop
  >
    <div
      class="item"
      v-for="(item, index) in options"
      :key="index"
      @click="handleShortcut(item.type);"
    >
      <i class="icon" :class="item.icon"></i>
      <span class="label">{{ item.title }}</span>
      <div
        v-if="item.type === 'heading'"
        v-show="headingOptionsShow"
        class="heading-options markdown-body"
      >
        <h1 @click="handleHeading(1);">Heading1</h1>
        <h2 @click="handleHeading(2);">Heading2</h2>
        <h3 @click="handleHeading(3);">Heading3</h3>
        <h4 @click="handleHeading(4);">Heading4</h4>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Shortcut',
  data() {
    return {
      headingOptionsShow: false,
      options: [
        {
          icon: 'iconheading',
          title: '标题',
          type: 'heading'
        },
        {
          icon: 'iconbold',
          title: '加粗',
          type: 'bold'
        },
        {
          icon: 'iconimage',
          title: '图片',
          type: 'image'
        },
        {
          icon: 'iconstrike',
          title: '中划线',
          type: 'strike'
        },
        {
          icon: 'iconcodeblock',
          title: '代码块',
          type: 'code-block'
        },
        {
          icon: 'icontable',
          title: '表格',
          type: 'table'
        },
        {
          icon: 'iconquote',
          title: '引用',
          type: 'quote'
        },
        {
          icon: 'iconlink',
          title: '链接',
          type: 'link'
        },
        {
          icon: 'iconoutdent',
          title: '减少缩进',
          type: 'outdent'
        },
        {
          icon: 'iconindent',
          title: '增加缩进',
          type: 'indent'
        },
        {
          icon: 'iconparagraph',
          title: '增加段落缩进',
          type: 'paragraph-indent'
        },
        {
          icon: 'iconitalic',
          title: '斜体',
          type: 'italic'
        },
        {
          icon: 'iconcode',
          title: '行内块',
          type: 'inline-code'
        },
        {
          icon: 'iconordered',
          title: '有序列表',
          type: 'order-list'
        },
        {
          icon: 'iconunordered',
          title: '无序列表',
          type: 'unorder-list'
        },
        {
          icon: 'icontask',
          title: '任务项',
          type: 'task-list'
        }
      ]
    };
  },
  computed: {
  },
  methods: {
    /**
     * 更新表示选中文本的对象
     */
    updateRange() {
      this.$emit('update-range');
    },
    /**
     * 切换heading选项的显示状态
     */
    toggleHeadingOptions() {
      this.headingOptionsShow = !this.headingOptionsShow;
    },
    /**
     * 处理快捷键点击事件函数
     * @param  {string} type 快捷键类型
     */
    handleShortcut(type) {
      let attr = {};

      if (['image', 'link'].includes(type)) {
        return this.$emit('show-select-table', type);
      }

      if (type === 'heading') {
        return this.toggleHeadingOptions();
      }

      if (type === 'table') {
        attr.capacity = { row: 5, col: 5 };
      }

      this.$emit('processing', type, attr);
    },
    /**
     * 处理heading
     * @param  {number} level heading的等级(h1,h2,h3...)
     */
    handleHeading(level) {
      this.$emit('processing', 'heading', { level });
    }
  }
};

</script>

<style lang="scss">

.shortcut {
  white-space: nowrap;
  > .item {
    position: relative;
    display: inline-block;
    width: 24px;
    line-height: 24px;
    text-align: center;
    vertical-align: middle;
    border: 1px solid transparent;
    > i {
      font-size: 1.2rem;
    }
    .label {
      display: none;
      position: absolute;
      left: 0;
      top: 150%;
      padding: 0 8px;
      border-radius: 2px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      white-space: nowrap;
      font-size: 1.2rem;
      line-height: 22px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.7);
    }
    .heading-options {
      position: absolute;
      left: 0;
      top: 100%;
      padding: 0 10px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      background-color: #fff;
      h1,
      h2,
      h3,
      h4 {
        margin: 0;
        padding: 7px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
    &:hover {
      cursor: pointer;
      border-color: #ccc;
    }
    &:hover .label {
      display: block;
    }
  }
  .theme-dark & {
    > .item {
      .heading-options {
        background-color: #252525;
      }
    }
    > .item:hover {
      border-color: rgba(255, 255, 255, 0.2);
      .label {
        background-color: #2a2a2a;
      }
    }
  }
}

</style>