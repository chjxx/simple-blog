/**
 * 插入文章或者链接等的组件
 */

<template>
  <div class="select-table" v-if="selectedTab" @click.stop>
    <!-- 图片插入 -->
    <div class="tab-image" v-show="selectedTab === 'image'">
      <header>插入图片<i class="icon iconclose" @click="closeTable"></i></header>
      <div class="ctnr">
        <!-- tab导航 -->
        <ul class="tab-nav">
          <li
            :class="{ nav__selected: isImageUrlForm }"
            @click="image.curForm = 'url';"
          >
            链接
          </li>
          <li
            :class="{ nav__selected: isImageFileForm }"
            @click="image.curForm = 'file';"
          >
            文件
          </li>
          <li
            :class="{ nav__selected: isImageResourceForm }"
            @click="switchToResource"
          >
            图片空间
          </li>
        </ul>
        <!-- tab内容区 -->
        <div class="tab-ct">
          <!-- url输入 -->
          <div class="url" v-show="isImageUrlForm">
            <input
              class="u-ipt-text1"
              type="text"
              name="url"
              v-model="image.url"
              placeholder="链接"
              autocomplete="off"
            />
            <input
              class="u-ipt-text1"
              type="text"
              name="title"
              v-model="image.title"
              placeholder="标题"
              autocomplete="off"
            />
            <button class="u-btn3" @click="insertImage">插入</button>
          </div>
          <!-- 本地文件选择 -->
          <div class="file" v-show="isImageFileForm">
            <label class="choose">
              <input
                type="file"
                accept="image/*"
                name="file"
                ref="imageFile"
                @change="changeImage"
              />
              <span class="u-btn3 btn">选择文件</span>
              <span class="filename">{{ image.filename }}</span>
            </label>
            <input
              class="u-ipt-text1"
              type="text"
              name="title"
              v-model="image.title"
              placeholder="标题"
              autocomplete="off"
            />
            <button class="u-btn3" @click="insertImage">插入</button>
          </div>
          <!-- 服务端资源选择 -->
          <div
            class="resource-ctnr"
            v-show="isImageResourceForm"
            ref="imgResource"
          >
            <div class="resources">
              <div
                class="image-ctnr"
                v-for="(image, key) in image.resources"
                :key="key"
              >
                <div
                  class="image"
                  :style="{ backgroundImage: `url('${image.filename}')` }"
                  @click="insertImage(image)"
                ></div>
              </div>
              <BarState class="statebar" :state="image.resourceState"></BarState>
              <BarTip class="statebar" v-if="noImageResources">无图片资源</BarTip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 链接插入 -->
    <div class="tab-link" v-if="selectedTab === 'link'">
      <header>插入链接<i class="icon iconclose" @click="closeTable"></i></header>
      <div class="ctnr" ref="link">
        <input
          class="u-ipt-text1"
          type="text"
          name="title"
          v-model="link.title"
          placeholder="标题"
          autocomplete="off"
        />
        <input
          class="u-ipt-text1"
          type="text"
          name="url"
          v-model="link.url"
          placeholder="链接"
          autocomplete="off"
        />
        <button class="u-btn3" @click="insertLink">插入</button>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

const [LOADING, ERROR, FINISH] = ['loading', 'error', 'finish'];

export default {
  name: 'SelectTable',
  props: {
    // 选择的tab
    selectedTab: {
      require: true
    },
    // 初始标题
    initialTitle: {
      type: String
    }
  },
  data() {
    return {
      // 图片插入模块配置
      image: {
        // 当前显示的表格
        curForm: 'url',
        // 图片标题
        title: this.initialTitle,
        // 图片链接
        url: '',
        // 本地选择的图片文件名
        filename: '',
        // 代表本地图片文件的对象
        file: null,
        // 服务端图片资源
        resources: [],
        // 服务端图片集信息加载状态
        resourceState: LOADING
      },
      // 链接插入模块配置
      link: {
        title: this.initialTitle,
        url: ''
      }
    };
  },
  computed: {
    noImageResources() {
      return this.image.resourceState === FINISH && !this.image.resources.length;
    },
    isImageUrlForm() {
      return this.image.curForm === 'url';
    },
    isImageFileForm() {
      return this.image.curForm === 'file';
    },
    isImageResourceForm() {
      return this.image.curForm === 'resources';
    }
  },
  methods: {
    /**
     * 初始化滚动
     */
    _initialScroll() {
      this.image._resourceScroll = new BScroll(this.$refs.imgResource, {
        click: true,
        mouseWheel: true
      });
    },
    /**
     * 切换到服务端图片选择界面
     */
    switchToResource() {
      // 切换到服务端图片选择界面
      this.image.curForm = 'resources';
      // 获取服务端图片集信息
      this.fetchImageResources();
    },
    /**
     * 获取服务端图片集信息
     */
    fetchImageResources() {
      this.image.resourceState = LOADING;
      this.$api.images
        .get()
        .then(resData => {
          this.image.resources = resData.data;

          this.image.resourceState = FINISH;
        })
        .catch(e => {
          this.imag.resourceState = ERROR;
        });
    },
    /**
     * 随着图片选择的改变而更新相应的信息
     */
    changeImage() {
      this.image.file = this.$refs.imageFile.files[0];
      // 更新图片文件名
      this.image.filename = this.image.file.name;
      this.image.url = window.URL.createObjectURL(this.image.file);
    },
    /**
     * 插入图片
     * @param  {Object} item 服务端图片信息
     */
    insertImage(item) {
      if (this.isImageUrlForm) {
        let { title, url } = this.image;

        this.insert('image', { title, url });
      } else if (this.isImageFileForm) {
        let { title, url, file, filename } = this.image;

        this.insert(
          'image',
          // 图片信息
          { title, url },
          // 图片文件信息
          { data: file, name: filename, title, url }
        );
      } else if (this.isImageResourceForm) {
        let { title, src } = item;

        this.insert('image', { title, url: src });
      }
    },
    /**
     * 插入链接
     */
    insertLink() {
      let { title, url } = this.link;

      this.insert('link', { title, url });
    },
    /**
     * 插入资源
     * @param  {string} type 类型(图片或者链接)
     * @param  {Object} data 相关信息
     * @param  {Object} fileData 图片文件
     * @return {[type]}
     */
    insert(type, data, fileData) {
      this.$emit('insert', type, data, fileData);
    },
    /**
     * 关闭选择窗
     */
    closeTable() {
      this.$emit('close');
    }
  },
  watch: {
    /**
     * 监听初始化标题，随着选中的文本改变而改变标题
     * @param  {string} newVal
     */
    initialTitle(newVal) {
      ['image', 'link'].forEach(tab => {
        this[tab].title = newVal;
        // 清空输入
        this[tab].url = '';
      });
    },
    /**
     * 监听是否切换到服务端图片选择界面，适当地添加图片列表滚动
     * @param  {Boolean}  newVal
     */
    isImageResourceForm(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this._initialScroll();
        });
      }
    }
  }
};
</script>

<style lang="scss">
.select-table {
  $borderColor: rgb(226, 229, 236);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  .tab-image,
  .tab-link {
    position: absolute;
    max-width: 400px;
    min-width: 260px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    > header {
      padding: 18px 15px 20px;
      font-size: 1.4rem;
      .icon {
        float: right;
        font-size: 1.2rem;
        transform: scale(0.8, 0.8);
        cursor: pointer;
        &:hover {
          font-weight: bold;
        }
      }
    }
  }
  .tab-image {
    .ctnr {
      .tab-nav {
        border-bottom: 1px solid #f0f0f0;
        list-style: none;
        > li {
          display: inline-block;
          margin-bottom: -1px;
          padding: 10px 20px;
          border-width: 1px;
          border-style: solid;
          border-color: transparent;
          font-size: 1.2rem;
          cursor: pointer;
          &:first-child {
            margin-left: 10px;
          }
          &.nav__selected {
            border-radius: 2px 2px 0 0;
            border-color: $borderColor $borderColor #fff $borderColor;
          }
        }
      }
      .tab-ct {
        $textInputHeight: 34px;
        $submitBtnHeight: 32px;
        .url {
          padding: 20px 10px;
          input {
            display: block;
            width: 100%;
            height: $textInputHeight;
            padding: 0 8px;
            &:not(:first-child) {
              margin-top: 15px;
            }
          }
          > button {
            margin-top: 25px;
            width: 100%;
            height: $submitBtnHeight;
            line-height: $submitBtnHeight;
          }
        }
        .file {
          padding: 20px 10px;
          .choose {
            display: block;
            width: 100%;
            height: $textInputHeight;
            line-height: $textInputHeight;
            font-size: 0;
            white-space: nowrap;
            input {
              display: none;
            }
            .btn {
              display: inline-block;
              width: 65px;
              height: $textInputHeight;
              border-radius: 2px 0 0 2px;
              font-size: 1.2rem;
              text-align: center;
            }
            .filename {
              display: inline-block;
              width: calc(100% - 65px);
              height: $textInputHeight;
              padding: 0 10px;
              border-width: 1px;
              border-style: solid;
              border-color: rgb(221, 221, 221) rgb(221, 221, 221)
                rgb(221, 221, 221) transparent;
              border-radius: 0 2px 2px 0;
              font-size: 1.2rem;
              vertical-align: top;
            }
          }
          > input {
            display: block;
            margin-top: 15px;
            width: 100%;
            height: $textInputHeight;
            padding: 0 8px;
          }
          > button {
            margin-top: 25px;
            width: 100%;
            height: $submitBtnHeight;
            line-height: $submitBtnHeight;
          }
        }
        .resource-ctnr {
          padding: 5px;
          max-height: 300px;
          font-size: 0;
          overflow: hidden;
          .resources {
            .image-ctnr {
              position: relative;
              display: inline-block;
              width: 33%;
              .image {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background-size: cover;
              }
              &::before {
                content: '';
                display: block;
                padding-top: 100%;
              }
            }
            .statebar{
              widows: 100%;
              height: 50px;
            }
          }
        }
      }
    }
  }
  .tab-link {
    $textInputHeight: 34px;
    $submitBtnHeight: 32px;
    .ctnr {
      padding: 10px 10px 20px 10px;
      input {
        display: block;
        width: 100%;
        height: $textInputHeight;
        padding: 0 8px;
        &:not(:first-child) {
          margin-top: 15px;
        }
      }
      button {
        margin-top: 25px;
        width: 100%;
        height: $submitBtnHeight;
        line-height: $submitBtnHeight;
      }
    }
  }
  .theme-dark & {
    background-color: rgba(255, 255, 255, 0.2);
    color: #a1a1a1;
    .tab-image,
    .tab-link {
      background-color: #252525;
    }
    .tab-image {
      .ctnr {
        .tab-nav {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          .nav__selected {
            border-color: rgba(255, 255, 255, 0.1);
            border-bottom-color: #252525;
          }
        }
        .tab-ct {
          .file {
            .choose {
              .filename {
                border-color: #2e2e2e #2e2e2e #2e2e2e transparent;
              }
            }
          }
        }
      }
    }
  }
}
</style>
