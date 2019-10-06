/** * 博客底部信息栏组件 */

<template>
  <footer class="m-ft">
    <div class="ctnr">
      <p class="contacts" v-if="contacts.length">
        联系:
        <a
          v-for="(contact, index) in contacts"
          :key="index"
          :href="contact.link || 'javascript:void(0)'"
          :class="{ info: contact.link === '' }"
          target="_blank"
          >{{ contact.name }}</a
        >
      </p>
      <p class="other">
        &copy; <span class="date">{{ currentYear }}</span>
        <span class="blogname">&nbsp;-&nbsp;&nbsp;{{ blogName }}</span>
        <a
          v-for="(item, index) in filling"
          :key="index"
          :href="item.link || 'javascript:void(0)'"
          class="filling"
          :class="{ info: item.link === '' }"
          target="_blank"
          >{{ item.name }}</a
        >
      </p>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Footer',
  computed: {
    ...mapGetters('blog', ['contacts', 'blogName', 'filling']),
    currentYear() {
      return new Date().getFullYear();
    }
  }
};
</script>

<style lang="scss">
$bodyWidth: 880px;
$footerHeight: 60px;
$lineHeight: 18px;
$linkColor: rgb(23, 81, 153);
$linkHoverColor: rgb(54, 141, 249);

.m-ft {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: $footerHeight;
  text-align: center;
  .ctnr {
    margin: 0 auto;
    max-width: $bodyWidth;
    height: 100%;
    padding-top: 15px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    p {
      font-size: 1.2rem;
      line-height: $lineHeight;
    }
    a {
      display: inline-block;
      padding: 0 10px;
      color: $linkColor;
      &:hover {
        color: $linkHoverColor;
      }
      &.info {
        color: #444;
        cursor: default;
      }
      &:not(:first-of-type) {
          border-left: 1px solid rgba(0, 0, 0, 0.1);
        }
    }
  }
  .theme-dark & {
    color: #444;
  }
}
@media screen and (max-width: 768px) {
  .m-ft {
    .ctnr {
      border-top: 0;
      background-color: #fff;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.03);
    }
    .theme-dark & {
      .ctnr {
        background-color: #1e1e1e;
      }
    }
  }
}
</style>
