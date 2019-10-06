/**
 * 文章标签接口
 */

import axios from 'axios';
import { convertToQuery } from 'common/scripts/utils';

export default {
  /**
   * 获取标签（文章标签）
   * @return {Promise}
   */
  get(pair = {}) {
    let query = convertToQuery(pair);

    return axios.get(`/api/tags${query}`);
  }
};