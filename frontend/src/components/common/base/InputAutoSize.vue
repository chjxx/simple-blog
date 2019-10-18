<template>
  <div class="u-autosize-input">
    <pre ref="pre" class="support"></pre>
    <textarea class="u-ipt-text1 input" v-model="curContent" ref="ctnr" @input="updateInput"></textarea>
  </div>
</template>

<script>

export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curContent: this.content,
      minHeight: null
    };
  },
  methods: {
    updateInput() {
      let elt = this.$refs.ctnr;

      if (elt) {
        let innerText = elt.value;
        let lastLine = innerText.split('\n').pop();

        if (lastLine === '') {
          innerText += ' ';
        }

        this.$refs.pre.innerText = innerText;
      }
    },
    getContent() {
      return this.curContent;
    }
  },
  watch: {
    curContent: {
      handler: 'updateInput',
      immediate: true
    }
  },
  mounted() {
    this.updateInput();
  }
};

</script>

<style lang="scss">

.u-autosize-input {
  position: relative;
  width: 100%;
  min-height: 52px;
  .support,
  .input {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    padding: 5px 5px;
  }
  .support {
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    visibility: hidden;
  }
  .input {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    resize: none;
    overflow: hidden;
  }
}

</style>