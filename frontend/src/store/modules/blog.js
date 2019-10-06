/**
 * 博客信息相关store
 */

import api from '@/api'; // 后端接口

// 主题
const THEMES = [
  {
    name: 'default',
    title: '默认',
    icon: 'iconlight',
    className: ''
  },
  {
    name: 'dark',
    title: '夜间',
    icon: 'iconnight',
    className: 'theme-dark'
  }
];

const state = {
  info: null, // 博客基础信息
  theme: {
    options: THEMES,
    selected: JSON.parse(initTheme())
  }
};

const getters = {
  logoCSSVal(state) {
    return state.info && state.info.logo ? `url(${state.info.logo})` : '';
  },
  blogName(state) {
    return state.info && state.info.name;
  },
  contacts(state) {
    return state.info ? state.info.contacts : [];
  },
  filling(state) {
    return state.info ? state.info.filling : [];
  },
  blogroll(state) {
    return state.info ? state.info.blogroll : [];
  },
  about(state) {
    return state.info ? state.info.about : '';
  },
  nextTheme(state) {
    let curIdx = state.theme.options.findIndex(
      theme => theme.name === state.theme.selected.name
    );

    return state.theme.options[(curIdx + 1) % state.theme.options.length];
  }
};

const mutations = {
  setInfo(state, bloginfo) {
    state.info = bloginfo;
  },
  setTheme(state, theme) {
    if (theme) {
      state.theme.selected = theme;
      window.localStorage.setItem('theme', JSON.stringify(theme));
      window.document.body.className = theme.className;
    }
  },
  switchToNextTheme() {
    this.commit('blog/setTheme', this.getters['blog/nextTheme']);
  }
};

const actions = {
  /**
   * 获取博客信息
   * @param  {Function} options.commit
   * @param  {Object} options.state
   * @param  {Function} options.dispatch
   */
  fetchInfo({ commit, state, dispatch }) {
    api.bloginfo
      .get()
      .then(resData => {
        commit('setInfo', resData.data);
      })
      .catch(err => {
        dispatch(
          'admin/notify',
          { type: 'error', content: err.message },
          { root: true }
        );
      });
  },
  /**
   * 更新博客信息
   * @param  {Function} options.commit
   * @param  {Object} options.state
   * @param  {Function} options.dispatch
   * @param  {FormData} formData
   * @return {Promise}
   */
  putInfo({ commit, state, dispatch }, formData) {
    return api.bloginfo
      .update(formData)
      .then(resData => {
        // 更新本地数据
        commit('setInfo', resData.data);
        // 发布消息
        dispatch(
          'admin/notify',
          { type: 'success', content: resData.message },
          { root: true }
        );
        return resData;
      })
      .catch(err => {
        // 发布消息
        dispatch(
          'admin/notify',
          { type: 'error', content: err.message },
          { root: true }
        );
        return Promise.reject(err);
      });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

/**
 * 初始化主题
 * @return {String}
 */
function initTheme() {
  let theme = window.localStorage.getItem('theme');

  // 如果localStorage没有存储信息
  if (!theme) {
    // 返回默认主题
    theme = JSON.stringify(THEMES[0]);
    // 将默认主题信息存储到localStorage
    window.localStorage.setItem('theme', theme);
  }

  return theme;
}
