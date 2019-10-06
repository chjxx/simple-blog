/**
 * 前台相关store
 */

const [MINI, NORMAL] = [0, 1];

const state = {
  // 移动端(viewPort宽度小于或等于768px)展示导航开关
  navShow: false,
  // pc端展示导航细节开关
  navMode: MINI,
  // 页面主要展示区域滚动盒子
  $scrollBox: null
};

const getters = {
  isNormalNav(state) {
    return state.navMode === NORMAL;
  }
};

const mutations = {
  switchToNormalNav() {
    state.navMode = NORMAL;
  },
  switchToMiniNav() {
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
    }, 100);
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};