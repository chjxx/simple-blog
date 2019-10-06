/**
 * 需要直接插入HTML文件的css和javascript
 */

import '../styles/inlinesource.scss';

(function() {
  let theme = window.localStorage.getItem('theme');

  if (theme) {
    theme = JSON.parse(theme);
    window.document.body.className = theme.className;
  }
})();