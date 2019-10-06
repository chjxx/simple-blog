/**
 * 账户登陆、注册页面主组件
 */

<template>
  <div id="sign">
    <div class="sign-ctnr">
      <!-- 组件标题 -->
      <p class="component-tt">{{componentTitle}}</p>
      <!-- 组件消息 -->
      <div class="component-msg" v-show="componentMsg">{{componentMsg}}<i class="icon iconclose btn-close" @click="cleanComponentMsg"></i></div>
      <keep-alive>
        <!-- 组件主体 -->
        <div class="component-body">
          <component :is="curComponent" @message="showComponentMsg" @switch="switchToComponent"></component>
        </div>
      </keep-alive>
      <!-- 组件提示 -->
      <div class="component-tip">
        <span v-show="isComponent('SignUp')">已有账号，去<a @click="switchToComponent('SignIn')">登陆</a></span>
        <span v-show="isComponent('SignIn')">没有账号，去<a @click="switchToComponent('SignUp')">注册</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import SignIn from './SignIn';
import SignUp from './SignUp';

export default {
  name: 'Sign',
  components: { SignIn, SignUp },
  data() {
    return {
      curComponent: 'SignIn',
      componentMsg: '',
      components: {
        SignIn: {
          name: 'SignIn',
          title: '登陆后台'
        },
        SignUp: {
          name: 'SignUp',
          title: '注册账号'
        }
      }
    };
  },
  computed: {
    componentTitle() {
      return this.components[this.curComponent].title;
    }
  },
  methods: {
    isComponent(name) {
      return this.curComponent === name;
    },
    cleanComponentMsg() {
      this.componentMsg = '';
    },
    showComponentMsg(msg) {
      this.componentMsg = msg;
    },
    switchToComponent(name) {
      this.cleanComponentMsg();
      this.curComponent = name;
    }
  }
};
</script>

<style lang="scss">
#sign {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  color: rgb(51, 51, 51);
  overflow-x: hidden;
  overflow-y: auto;
  .sign-ctnr {
    margin: 0 auto;
    width: 300px;
    transition: all 0.2s;
    overflow: hidden;
    >.component-tt {
      margin-top: 50px;
      padding: 10px 0 20px 0;
      font-size: 2.4rem;
      font-weight: 100;
      text-align: center;
      color: #777;
    }
    >.component-msg{
      position: relative;
      margin-top: 15px;
      padding: 15px 36px 15px 15px;
      border: 1px solid rgba(255, 0, 0, .3);
      border-radius: 5px;
      font-size: 1.4rem;
      line-height: 16px;
      background-color: rgba(255, 0, 0, .15);
      color: #666;
      .btn-close {
        position: absolute;
        top: 0;
        right: 0;
        padding: 15px 15px 15px 5px;
        transform: scale(0.6, 0.6);
        font-weight: 700;
        color: rgb(134, 24, 29);
        opacity: .6;
        transition: all 0;
        &:hover {
          opacity: 1;
        }
      }
    }
    >.component-body {
      margin-top: 15px;
      background-color: white;
      border: 1px solid rgba(0,0,0,.125);
      border-radius: 5px;
      box-shadow: 0 0 1px rgba(0,0,0,.05);

    }
    >.component-tip{
      margin-top: 15px;
      padding: 15px 0;
      border: 1px solid rgb(216, 222, 226);
      border-radius: 5px;
      font-size: 1.4rem;
      color: #666;
      text-align: center;
      a {
        color: rgb(3, 102, 214);
      }
    }
  }
  .theme-dark & {
    background-color: #111;
    .sign-ctnr {
      .component-body {
        background-color: #252525;
      }
      .component-tip {
        border-color: rgba(255, 255, 255, .1);
      }
    }
  }
}
</style>
