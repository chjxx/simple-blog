/**
 * 图片资源接口
 */

import axios from 'axios';

export default {
  /**
   * 获取图片资源
   * @return {Promise}
   */
  get() {
    return axios.get('/api/images');
  },
  /**
   * 上传图片资源
   * @param  {FormData} formData
   * @return {Promise}
   */
  upload(formData) {
    return axios.post(`/api/images`, formData);
  }
};