/**
 * 文章接口
 */

import axios from 'axios';
import { convertToQuery } from 'common/scripts/utils';

export default {
  /**
   * 获取文章
   * @param  {Object} pair
   * @return {Promise}
   */
  get(pair = {}) {
    let query = convertToQuery(pair);

    return axios.get(`/api/posts${query}`);
  },
  /**
   * 获取已发布的文章
   * @param  {Object} pair
   * @return {Promise}
   */
  getPublished(pair = {}) {
    pair.state = 'published';
    return this.get(pair);
  },
  /**
   * 获取草稿
   * @param  {Object} pair
   * @return {Promise}
   */
  getEditing(pair = {}) {
    pair.state = 'editing';
    return this.get(pair);
  },
  /**
   * 获取已发布文章中包含指定关键字的文章
   * @param  {string} key
   * @return {Promise}
   */
  getByKey(key) {
    return this.get({ key });
  },
  /**
   * 获取已发布文章中包含指定标签的文章
   * @param  {Array} tags
   * @return {Promise}
   */
  getByTags(tags) {
    return this.get({ tags });
  },
  /**
   * 根据文章ID获取某篇文章
   * @param  {string} ID
   * @param  {Object} pair
   * @return {Promise}
   */
  getByID(ID, pair = {}) {
    let query = convertToQuery(pair);

    return axios.get(`/api/posts/${ID}${query}`);
  },
  /**
   * 创建文章
   * @param  {FormData} postForm
   * @return {Promise}
   */
  create(postForm) {
    return axios.post('/api/posts', postForm);
  },
  /**
   * 更新某篇文章
   * @param  {FormData} postForm
   * @return {Promise}
   */
  update(postForm) {
    return axios.put(`/api/posts/${postForm.get('_id')}`, postForm);
  },
  /**
   * 删除某篇文章
   * @param  {string} ID
   * @return {Promise}
   */
  delete(ID) {
    return axios.delete(`/api/posts/${ID}`);
  }
};
