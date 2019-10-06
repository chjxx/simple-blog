/**
 * 检查用户输入格式的函数
 */

/**
 * 检查用户名，如果有误则直接报错
 * @param  {string} name
 * @return {undefined}
 */
function checkAccountName(name) {
  let Pattern = /^[a-zA-Z][\w]{4,11}$/; // 首字符必须为字母
  if (!Pattern.test(name)) {
    throw new Error('用户名需为 5－12 个大小写字母、数字、下划线(_)组成！');
  }
}

/**
 * 检查用户邮箱，如果有误则直接报错
 * @param  {string} email
 * @return {undefined}
 */
function checkAccountEmail(email) {
  let Pattern = /^[\w]+@[\w]+\.[\w]+$/;
  if (!Pattern.test(email)) {
    throw new Error('邮箱格式有误！');
  }
}

/**
 * 检查用户头像，如果有误则直接报错
 * @param  {string} avatar
 * @return {undefined}
 */
function checkAccountAvatar(avatar) {
  if (avatar.name === '') {
    throw new Error('需选择头像！');
  }
}

/**
 * 检查用户密码，如果有误则直接报错
 * @param  {string} password
 * @return {undefined}
 */
function checkAccountPassword(password) {
  /* eslint-disable no-useless-escape */
  let Pattern = /^[\w]{6,20}$/; // 6-20 个大小写字母、数字、_
  if (!Pattern.test(password)) {
    throw new Error(
      '用户密码需为 6－20 个大小写字母、数字、下划线(_)、英文句号(.)组成！'
    );
  }
}

/**
 * 检查用户新密码，如果有误则直接报错
 * @param  {FormData} form
 * @return {undefined}
 */
function checkAccountNewPassword(form) {
  if (form.get('password') === form.get('newpassword')) {
    throw new Error('新密码不能与旧密码相同!');
  }
}

/**
 * 检查用户重复密码，如果有误则直接报错
 * @param  {FormData} form
 * @return {undefined}
 */
function checkAccountConfirmPassword(form) {
  if (form.get('password') !== form.get('confirmpassword')) {
    throw new Error('两次密码输入不一致！');
  }
}

/**
 * 检查账户信息输入值的合法性
 * @param  { formData or array } formData
 * @return {undefined｜Error}
 */
export function checkAccountFormat(formData) {
  // 生成键值对
  let pairs = formData.entries();
  // 拦截报错
  try {
    for (let pair of pairs) {
      switch (pair[0]) {
        case 'name':
          checkAccountName(pair[1]);
          break;
        case 'email':
          checkAccountEmail(pair[1]);
          break;
        case 'avatar':
          checkAccountAvatar(pair[1]);
          break;
        case 'password':
          checkAccountPassword(pair[1]);
          break;
        case 'newpassword':
          checkAccountNewPassword(formData);
          break;
        case 'confirmpassword':
          checkAccountConfirmPassword(formData);
      }
    }
  } catch (err) {
    return err;
  }
}

// ----------------------------- 文章 -----------------------------------------------

/**
 * 检查文章标题，如果有误则直接报错
 * @param  {string} title
 * @return {undefined}
 */
function checkPostTitle(title) {
  if (title.trim().length < 6) {
    throw new Error('文章标题至少6个字符以上');
  }
}

/**
 * 检查文章命名链接，如果有误则直接报错
 * @param  {string} namedLink
 * @return {undefined}
 */
function checkPostNamedLink(namedLink) {
  const NamedLinkPattern = /^[\w]*$/;
  if (!NamedLinkPattern.test(namedLink)) {
    throw new Error('命名链接只能包含字母、数字及下划线');
  }
}

/**
 * 检查文章内容，如果有误则直接报错
 * @param  {string} content
 * @return {undefined}
 */
function checkPostContent(content) {
  if (content.trim().length < 10) {
    throw new Error('文章内容至少10个字符以上');
  }
}

/**
 * 检查文章信息输入值的合法性
 * @param  { formData or array } formData
 * @return {undefined｜Error}
 */
export function checkPostFormat(formData) {
  // 生成键值对
  let pairs = formData.entries();
  // 拦截报错
  try {
    for (let pair of pairs) {
      switch (pair[0]) {
        case 'title':
          checkPostTitle(pair[1]);
          break;
        case 'namedLink':
          checkPostNamedLink(pair[1]);
          break;
        case 'content':
          checkPostContent(pair[1]);
      }
    }
  } catch (err) {
    return err;
  }
}