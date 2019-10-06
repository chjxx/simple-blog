/**
 * 文章修改组件中的封面选择组件
 */

<template>
  <div class="cover">
    <p class="tt">封面</p>
    <label class="ct">
      <input
        type="file"
        accept="image/*"
        name="cover"
        @change="changeCover"
        ref="cover"
      />
      <i class="icon iconplus1"></i>
      <div
        class="preview"
        :style="{ backgroundImage: coverBgImgString }"
      ></div>
    </label>
  </div>
</template>

<script>

export default {
  props: {
    postCover: {
      type: [String, File]
    }
  },
  data() {
    return {
      cover: this.postCover,
      // 文章封面是否改变
      coverChanged: false
    };
  },
  computed: {
    coverBgImgString() {
      return `url(${this.cover})`;
    }
  },
  methods: {
    /**
     * 修改文章封面
     */
    changeCover() {
      this.coverChanged = true;
      this.cover = window.URL.createObjectURL(this.$refs.cover.files[0]);
    },
    getCover() {
      return this.coverChanged ? this.$refs.cover.files[0] : null;
    }
  }
};

</script>

<style lang="scss">

.cover {
  .tt {
    font-size: 1.4rem;
    line-height: 30px;
  }
  .ct {
    display: block;
    position: relative;
    width: 100%;
    height: 120px;
    line-height: 120px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.05);
    text-align: center;
    input {
      display: none;
    }
    .icon {
      font-size: 5rem;
      color: #ddd;
    }
    .preview {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }
  }
  .theme-dark & {
    .ct {
      background-color: rgba(0, 0, 0, 0.2);
      .icon {
        color: #444;
      }
    }
  }
}

</style>