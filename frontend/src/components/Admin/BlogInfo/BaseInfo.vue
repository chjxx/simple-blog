/** * 博客基础信息更改组件 */

<template>
  <div class="baseinfo">
    <header>博客基础信息</header>
    <form
      class="m-form-setting"
      ref="form"
      @submit.prevent="updateBaseinfo"
      v-if="bloginfoCopy"
    >
      <!-- LOGO -->
      <div class="img-item">
        <span class="title">LOGO： </span>
        <div class="preview" :style="{ backgroundImage: logoCSSVal }"></div>
        <label class="change">
          修改
          <input
            name="logo"
            type="file"
            ref="logo"
            accept="image/*"
            @change="changeLogo"
          />
        </label>
      </div>
      <!-- 博客名 -->
      <label class="input-item">
        <span class="title">博客名：</span>
        <input
          class="u-ipt-text1"
          type="text"
          name="name"
          placeholder="博客名"
          autocomplete="off"
          v-model="bloginfoCopy.name"
        />
      </label>
      <!-- 备案 -->
      <label
        class="input-item"
        @input="autoInsertInputItem(bloginfoCopy.filling);"
      >
        <span class="title">备案：</span>
        <div
          class="inputs-2"
          v-for="(item, index) in bloginfoCopy.filling"
          :key="index"
        >
          <input
            class="u-ipt-text1"
            type="text"
            v-model="item.name"
            placeholder="标题"
            autocomplete="off"
          />
          <input
            class="u-ipt-text1"
            type="text"
            v-model="item.link"
            placeholder="链接"
            autocomplete="off"
          />
        </div>
      </label>
      <!-- 分割线 -->
      <div class="crossline"></div>
      <!-- 联系方式 -->
      <div
        class="input-item"
        @input="autoInsertInputItem(bloginfoCopy.contacts);"
      >
        <span class="title">联系方式： </span>
        <div
          class="inputs-2"
          v-for="(item, index) in bloginfoCopy.contacts"
          :key="index"
        >
          <input
            class="u-ipt-text1"
            type="text"
            v-model="item.name"
            placeholder="标题"
            autocomplete="off"
          />
          <input
            class="u-ipt-text1"
            type="text"
            v-model="item.link"
            placeholder="链接"
            autocomplete="off"
          />
        </div>
      </div>
      <!-- 提交按钮 -->
      <div class="submit">
        <ButtonState class="btn" :state="state">保存</ButtonState>
      </div>
    </form>
  </div>
</template>

<script>
import { cloneDeep } from 'common/scripts/utils';
import { compressImage } from 'common/scripts/fileUtils';

const [LOADING, FINISH] = ['loading', 'finish'];

export default {
  name: 'BaseInfo',
  data() {
    return {
      logoChanged: false,
      bloginfoCopy: null,
      state: FINISH
    };
  },
  props: {
    bloginfo: {
      type: Object
    }
  },
  computed: {
    logoCSSVal() {
      return `url(${this.bloginfoCopy.logo || ''})`;
    }
  },
  methods: {
    /**
     * 改变LOGO
     */
    changeLogo() {
      // 标记LOGO已经被改变，以便之后更新信息时将图片上传
      this.logoChanged = true;

      this.bloginfoCopy.logo = window.URL.createObjectURL(
        this.$refs.logo.files[0]
      );
    },
    /**
     * 自动判断及适时插入新输入框
     * @param  {Object} inputItems
     */
    autoInsertInputItem(inputItems) {
      let lastContactItem = inputItems[inputItems.length - 1];
      // 如果最后一组联系方式输入框都有文本，则插入一组新的输入框
      if (lastContactItem.name !== '' && lastContactItem.link !== '') {
        inputItems.push({ name: '', link: '' });
      }
    },
    /**
     * 更新博客基础信息
     */
    updateBaseinfo() {
      let vm = this;
      let formData = new FormData(this.$refs.form);

      this.state = LOADING;

      // 如果LOGO未改变，则删除logo属性，不上传LOGO
      if (!this.logoChanged) {
        formData.delete('logo');
      }
      // 剔除空的联系方式键值对
      let contacts = this.bloginfoCopy.contacts.filter(item => {
        return item.name.trim() !== '' && item.link.trim() !== '';
      });
      // 将原有的数组转成字符串，以便传输及后续服务端的处理
      formData.set('contacts', JSON.stringify(contacts));
      // 剔除空的备案键值对
      let filling = this.bloginfoCopy.filling.filter(item => {
        return item.name.trim() !== '' && item.link.trim() !== '';
      });
      // 将原有的数组转成字符串，以便传输及后续服务端的处理
      formData.set('filling', JSON.stringify(filling));

      return new Promise((resolve, reject) => {
        if (this.logoChanged) {
          compressImage(this.$refs.logo.files[0], {
            eWidth: 300,
            eHeight: 300,
            size: 'cut',
            position: {
              x: 'center',
              y: 'middle'
            }
          }).then(blob => {
            formData.set('logo', blob, `logo.${blob.type.split('/').pop()}`);

            resolve();
          });
        } else {
          // 如果LOGO未改变，则删除logo属性，不上传LOGO

          formData.delete('logo');
          resolve();
        }
      }).then(() => {
        // 两个cb，第一个是成功的回调，第二个是失败的回调
        this.$emit('update', formData, cb, cb);
      });

      function cb() {
        vm.state = FINISH;
      }
    }
  },
  created() {
    // 拷贝一份方便后续直接修改而不会改动到原有数据
    this.bloginfoCopy = cloneDeep(this.bloginfo);
    // 初始化先手动插入一组新的联系方式和备案输入框，后续会跟据文本的输入来判断及自动插入
    this.bloginfoCopy.contacts.push({ name: '', link: '' });
    this.bloginfoCopy.filling.push({ name: '', link: '' });
  }
};
</script>

<style lang="scss">
.baseinfo {
  margin: 0 auto;
  max-width: 880px;
  border-radius: 3px;
  background-color: #fff;
  header {
    padding: 20px;
    font-size: 1.7rem;
    font-weight: 100;
    border-bottom: 1px solid rgb(221, 221, 221);
  }
  .theme-dark & {
    background-color: #1e1e1e;
    color: #a1a1a1;
    header {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }
  @media screen and (max-width: 768px) {
    header {
      padding: 15px;
    }
  }
}
</style>
