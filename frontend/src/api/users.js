/**
 * 账户接口
 */

import axios from 'axios';
import { convertToQuery } from 'common/scripts/utils';

export default {
  /**
   * 获取当前登录账户的信息
   * @param  {Object} pair query对象
   * @return {Promise}
   */
  getAccountInfo(pair = {}) {
    let query = convertToQuery(pair);

    return axios.get(`/api/account${query}`);
  },
  /**
   * 获取当前登陆的管理员的账户信息，主要用来判断当前登陆的是否是管理员账户
   * @return {Promise}
   */
  getAdminAccountInfo() {
    return this.getAccountInfo({ admin: true });
  },
  /**
   * 注册账户
   * @param  {Object} pair query对象
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  signUp(pair, accountForm) {
    let query = convertToQuery(pair);

    return axios.post(`/api/signup${query}`, accountForm);
  },
  /**
   * 登陆账户
   * @param  {Object} pair query对象
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  signIn(pair, accountForm) {
    let query = convertToQuery(pair);

    return axios.post(`/api/signin${query}`, accountForm);
  },
  /**
   * 注册管理员账户
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  signUpByAdmin(accountForm) {
    return this.signUp({ admin: true }, accountForm);
  },
  /**
   * 登陆管理员账户
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  signInByAdmin(accountForm) {
    return this.signIn({ admin: true }, accountForm);
  },
  /**
   * 更新账户信息
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  update(accountForm) {
    return axios.put('/api/account', accountForm);
  },
  /**
   * 更新账户密码
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  updatePassword(accountForm) {
    return axios.put('/api/account/password', accountForm);
  },
  /**
   * 登出
   * @param  {FormData} accountForm
   * @return {Promise}
   */
  signOut() {
    return axios.get('/api/signout');
  }
};