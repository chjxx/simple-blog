/**
 * 博客信息接口
 */

import axios from 'axios';

export default {
  /**
   * 获取博客信息
   * @return {Promise}
   */
  get() {
    return axios.get(`/api/bloginfo`);
  },
  /**
   * 更新博客信息
   * @param  {FormData} bloginfoForm
   * @return {Promise}
   */
  update(bloginfoForm) {
    return axios.put('/api/bloginfo', bloginfoForm);
  }
};