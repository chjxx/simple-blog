/**
 * 隐藏或者显示全屏加载页面
 */

function show() {
  window.requestAnimationFrame(function next() {
    let loading = document.querySelector('.loading-ct');
    loading.style.display = 'block';
  });
}

function hide() {
  window.requestAnimationFrame(function next() {
    let loading = document.querySelector('.loading-ct');
    loading.style.display = 'none';
  });
}

export default { show, hide };