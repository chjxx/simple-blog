/**
 * 管理后台相关store
 */

// 消息类型
const MSG_TYPE = ['success', 'error'];
const [SUCCESS, ERROR] = MSG_TYPE;
// 导航条模式
const [MINI, NORMAL] = [0, 1];

const state = {
  // 移动端展示导航开关
  navShow: false,
  // pc端展示导航细节开关
  navMode: MINI,
  // 页面主要展示区域滚动盒子
  $scrollBox: null,
  // 消息队列
  messages: []
};

const getters = {
  isNormalNav(state) {
    return state.navMode === NORMAL;
  }
};

const mutations = {
  switchToNormalNav(state) {
    state.navMode = NORMAL;
  },
  switchToMiniNav(state) {
    state.navMode = MINI;
  },
  showNav(state) {
    state.navShow = true;
  },
  hideNav(state) {
    state.navShow = false;
  },
  switchNav(state) {
    state.navShow = !state.navShow;
  },
  setScrollBox(state, el) {
    el && (state.$scrollBox = el);
  },
  addScrollBoxListener(state, fn) {
    state.$scrollBox.addEventListener('scroll', fn);
  },
  removeScrollBoxListener(state, fn) {
    state.$scrollBox.removeEventListener('scroll', fn);
  },
  /**
   * 滚动到内容的某个位置
   * @param  {Object} state
   * @param  {number} val
   */
  scrollTo(state, val) {
    state.$scrollBox && (state.$scrollBox.scrollTop = val);
  },
  /**
   * 滚动到内容顶部
   * @param  {Object} state
   */
  scrollToTop(state) {
    if (!state.$scrollBox) return;

    let timer = 200;
    let duration = state.$scrollBox.scrollTop;
    let startTime = Date.now();

    window.requestAnimationFrame(function a() {
      let passedTime = Date.now() - startTime;
      let count = passedTime / timer * duration;
      state.$scrollBox.scrollTop = Math.max(duration - count, 0);

      if (passedTime >= timer) {
        state.$scrollBox.scrollTop = 0;
      } else {
        window.requestAnimationFrame(a);
      }
    });
  },
  /**
   * 将消息推入消息队列
   * @param  {Object} state
   * @param  {Object} message
   */
  pushMessage(state, message) {
    state.messages.push(message);
  },
  /**
   * 删除消息队列中第一个消息
   * @param  {Object} state
   */
  shiftMessage(state) {
    state.messages.shift();
  }
};

const actions = {
  /**
   * 重置导航条格式
   * @param  {Function} options.commit
   */
  resetNavState({ commit }) {
    if (window.innerWidth > 768) {
      commit('switchToMiniNav');
    } else {
      commit('switchToNormalNav');
      commit('hideNav');
    }
  },
  /**
   * 发布页面消息
   * @param  {Object} options.state
   * @param  {Function} options.commit
   * @param  {Object} message
   */
  notify({ state, commit }, message) {
    let key = Math.random() * 10000000 + 8; // 取个随机数做key

    message.key = key;

    if (message.type === ERROR) {
      message.class = 'message__error';
    } else {
      message.class = 'message__success';
    }

    commit('pushMessage', message);
    // 3秒后删除
    setTimeout(() => {
      commit('shiftMessage');
    }, 3000);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
