import Vue from 'vue';

// 创建一个 以传入的参数限定上下文的 require函数
const requireComponent = require.context('./', false, /\w+\.vue$/);

// 分别对每个文件进行处理
requireComponent.keys().forEach(filepath => {
  // 以文件路径获得文件内容
  const component = requireComponent(filepath);
  // 以组件文件名为组件名
  const componentName = filepath.split('/').pop().replace(/\.vue$/, '');
  // 注册通用组件
  Vue.component(componentName, component.default || component);
});