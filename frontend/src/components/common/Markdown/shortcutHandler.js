/**
 * 处理快捷键点击事件的函数
 */

import { generateString, isType, escapeREString } from '@/common/scripts/utils';

/**
 * 一个简单订阅发布模式的类
 */
class Task {
  constructor() {
    this.handler = [];
  }
  emit(type, ...args) {
    if (this.handler[type]) {
      this.handler[type].forEach(fn => fn(...args));
    }
  }
  watch(type, fn) {
    this.handler[type] = this.handler[type] || [];
    this.handler[type].push(fn);
  }
}

let task = new Task();

/**
 * 处理标题
 * @param  {string} 'heading'
 * @param  {Object} { range, container, attr }
 */
task.watch('heading', ({ range, container, attr }) => {
  let prefixRE = /^#+\s/;

  handleLinePrefix({
    range,
    container,
    prefix: prefixRE,
    generatePrefix() {
      return generateString('#', attr.level) + ' ';
    }
  });
});

/**
 * 处理引用
 * @param  {string} 'quote'
 * @param  {Object} { range, container }
 */
task.watch('quote', ({ range, container }) => {
  handleLinePrefix({
    range,
    container,
    prefix: '> '
  });
});

/**
 * 处理数据表格
 * @param  {string} 'table'
 * @param  {Object} { range, container, attr }
 */
task.watch('table', ({ range, container, attr }) => {
  let lines = generateTableMDText(attr.capacity);

  handleLineInsert({
    range,
    container,
    lines
  });
});

/**
 * 处理代码块
 * @param  {string} 'code-block'
 * @param  {Object} { range, container }
 */
task.watch('code-block', ({ range, container }) => {
  handleLineSurround({
    range,
    container,
    sign: '```'
  });
});

/**
 * 处理增加缩进
 * @param  {string} 'indent'
 * @param  {Object} { range, container }
 */
task.watch('indent', ({ range, container }) => {
  let prefixRE = /\s{4}/;
  let prefix = generateString('&nbsp;', 4);

  handleLinePrefix({
    range,
    container,
    prefix: prefixRE,
    generatePrefix() {
      return prefix;
    },
    recover: false,
    html: true
  });
});

/**
 * 处理减少缩进
 * @param  {string} 'outdent'
 * @param  {Object} { range, container }
 */
task.watch('outdent', ({ range, container }) => {
  let signREString = escapeREString('&nbsp;');
  let prefixRE = new RegExp(`^(${signREString}|\\s){0,4}`);

  handleLinePrefix({
    range,
    container,
    prefix: prefixRE,
    generatePrefix() {
      return '';
    },
    html: true
  });
});

/**
 * 处理有序列表
 * @param  {string} 'order-list'
 * @param  {Object} { range, container }
 */
task.watch('order-list', ({ range, container }) => {
  let prefixRE = /^([0-9]+\.\s|\*\s)/;

  handleLinePrefix({
    range,
    container,
    prefix: prefixRE,
    generatePrefix(idx) {
      return `${idx + 1}. `;
    }
  });
});

/**
 * 处理无序列表
 * @param  {string} 'unorder-list'
 * @param  {Object} { range, container }
 */
task.watch('unorder-list', ({ range, container }) => {
  handleLinePrefix({
    range,
    container,
    prefix: '* '
  });
});

/**
 * 处理任务列表
 * @param  {string} 'task-list'
 * @param  {Object} { range, container }
 */
task.watch('task-list', ({ range, container }) => {
  handleLinePrefix({
    range,
    container,
    prefix: '- [ ] '
  });
});

/**
 * 处理图片
 * @param  {string} 'image'
 * @param  {Object} { range, container, attr }
 */
task.watch('image', ({ range, container, attr }) => {
  let insertion = `![${attr.title}](${attr.url} "${attr.title}")`;

  handleInlineInsert({
    range,
    container,
    insertion
  });
});

/**
 * 处理链接
 * @param  {string} 'link'
 * @param  {Object} { range, container, attr }
 */
task.watch('link', ({ range, container, attr }) => {
  let insertion = `[${attr.title}](${attr.url} "${attr.title}")`;

  handleInlineInsert({
    range,
    container,
    insertion
  });
});

/**
 * 处理加粗
 * @param  {string} 'bold'
 * @param  {Object} { range }
 */
task.watch('bold', ({ range, container }) => {
  handleInlineSurround({
    range,
    container,
    sign: '**'
  });
});

/**
 * 处理行内代码
 * @param  {string} 'inline-code'
 * @param  {Object} { range }
 */
task.watch('inline-code', ({ range, container }) => {
  handleInlineSurround({
    range,
    container,
    sign: '`'
  });
});

/**
 * 处理中划线
 * @param  {string} 'strike'
 * @param  {Object} { range }
 */
task.watch('strike', ({ range, container }) => {
  handleInlineSurround({
    range,
    container,
    sign: '~'
  });
});

/**
 * 处理斜体
 * @param  {string} 'italic'
 * @param  {Object} { range }
 */
task.watch('italic', ({ range, container }) => {
  handleInlineSurround({
    range,
    container,
    sign: '*'
  });
});

/**
 * 处理复制粘贴
 * @param  {string} 'paste-line'
 * @param  {Object} ({ range, container, attr }
 */
task.watch('paste-line', ({ range, container, attr }) => {
  handleLineInsert({ range, container, lines: attr.lines });
});

/**
 * 处理复制粘贴
 * @param  {string} 'paste-inline'
 * @param  {Object} ({ range, container, attr }
 */
task.watch('paste-inline', ({ range, container, attr }) => {
  handleInlineInsert({ range, container, insertion: attr.insertion });
});

export default {
  handle(type, options) {
    task.emit(type, options);
  }
};

// -------------------- utils ------------------------------

/**
 * 处理行内的插入
 * @param  {Object} options.range 代表选中文本的对象
 * @param  {Object} options.container 编辑区的容器元素
 * @param  {string|Function} options.insertion 插入的文本，如果是函数则执行函数，以函数的返回值为插入的文本
 */
function handleInlineInsert({ range, container, insertion }) {
  if (isType(insertion, 'Function')) {
    insertion = insertion();
  } else if (!isType(insertion, 'String')) {
    return;
  }

  let { elements, singled } = getElementRange(range, container);

  let { startContainer, endContainer, startOffset, endOffset } = range;
  let startContent = startContainer.textContent.slice(0, startOffset);
  let endContent = endContainer.textContent.slice(endOffset);
  let endOffsetNow = startOffset + insertion.length;
  // 因为是插入文本片段，不是多行，所以如果选中多行，除了第一行，其它行都删除
  if (!singled) {
    elements.forEach((elm, index) => {
      if (index !== 0) {
        elm.parentNode.removeChild(elm);
      }
    });
  }

  startContainer.textContent = startContent + insertion + endContent;
  // 调整选区
  range.setStart(startContainer, startOffset);
  range.setEnd(startContainer, endOffsetNow);
}

/**
 * 处理行内字符串包裹
 * @param  {Object} options.range 代表选中文本的对象
 * @param  {Object} options.container 编辑区的容器元素
 * @param  {string} options.sign 包裹选中的文本的符号
 */
function handleInlineSurround({ range, container, sign }) {
  if (!isType(sign, 'String')) {
    return;
  }

  // 符号正则表达式字符串
  let signREString = escapeREString(sign);
  // 符号正则表达试
  let signRE = new RegExp(`^${signREString}(.+)${signREString}$`);
  let { startContainer, endContainer, startOffset, endOffset } = range;
  let textContent = startContainer.textContent;
  let startContent, endContent;
  // 选中的文本片断
  let selectedSnippet = range.toString();

  // 如果不是选择单行，或者加工的元素不是text类型，或者没选择任何文本
  if ((startContainer !== endContainer) || startContainer.nodeType !== 3 || (selectedSnippet === '')) return;

  startContent = textContent.slice(0, startOffset);
  endContent = textContent.slice(endOffset);

  let matched = selectedSnippet.match(signRE);
  let endOffsetNow;

  // 如果有符号匹配则删除
  if (matched) {
    startContainer.textContent = `${startContent}${matched[1]}${endContent}`;

    endOffsetNow = startOffset + matched[1].length;
  } else {
    // 如果没有符号匹配则添加
    startContainer.textContent = `${startContent}${sign}${selectedSnippet}${sign}${endContent}`;

    endOffsetNow = startOffset + selectedSnippet.length + sign.length * 2;
  }

  // 调整选中区域，因为有时是删除符号，有时是增加符号
  range.setStart(range.startContainer, startOffset);
  range.setEnd(range.startContainer, endOffsetNow);
}

/**
 * 处理行的前缀
 * @param  {Object} options.range 代表选中文本的对象
 * @param  {Object} options.container 编辑区的容器元素
 * @param  {string|Function}  options.prefix 行前缀，和下面的generatePrefix(生成行前缀函数)配合使用。如果为字符串，generatePrefix则不能有
 * @param  {Function}  options.generatePrefix 生成行前缀函数，和上面prefix配合使用。如果prefix为正则表达式，此函数为必须有
 * @param  {Boolean} options.recover 当选中的行包含该前缀，是否可以删除前缀
 * @param  {Boolean} options.html 是否用innerHTML来匹配和赋值，默认为textContent属性
 */
function handleLinePrefix({ range, container, prefix, generatePrefix, recover = true, html = false }) {
  let prefixRE, propertyName;

  if (isType(prefix, 'RegExp') && isType(generatePrefix, 'Function')) {
    prefixRE = prefix;
  } else if (isType(prefix, 'String') && isType(generatePrefix, 'Undefined')) {
    let prefixREString = escapeREString(prefix);

    prefixRE = new RegExp(`^${prefixREString}`);
  } else {
    return;
  }

  if (html) {
    propertyName = 'innerHTML';
  } else {
    propertyName = 'textContent';
  }

  let { elements, endElement } = getElementRange(range, container);

  let hasPrefixed = elements.every(elm => prefixRE.test(elm[propertyName]));

  // 如果可以删除前缀并且有匹配到前缀
  if (recover && hasPrefixed) {
    elements.forEach(elm => {
      elm[propertyName] = elm[propertyName].replace(prefixRE, '');
    });
  } else {
    elements.forEach((elm, idx) => {
      let prefixString;

      if (generatePrefix) {
        prefixString = generatePrefix(idx);
      } else {
        prefixString = prefix;
      }
      // 如果不可以删除前缀或者没有匹配到前缀，则直接添加前缀
      if (!recover || !prefixRE.test(elm[propertyName])) {
        elm[propertyName] = prefixString + elm[propertyName];
      }
    });
  }
  // 调整选中区域
  range.setEnd(endElement, endElement.childNodes.length);
}

/**
 * 处理行的包裹
 * @param  {Object} options.range 代表选中文本的对象
 * @param  {Object} options.container 编辑区的容器元素
 * @param  {string} options.sign 包裹选中的行的符号
 */
function handleLineSurround({ range, container, sign }) {
  let signREString = escapeREString(sign);
  let signRE = new RegExp(`^${signREString}`);
  let startElementNow, endElementNow, startOffsetNow, endOffsetNow, endIndexNow;
  // 选中的子元素及相关数据
  let { startElement, endElement, startIndex, endIndex, singled } = getElementRange(range, container);

  // 如果只选中单行
  if (singled) {
    // 插入符号
    startElement.outerHTML = `<div>${sign}</div>${startElement.outerHTML}<div>${sign}</div>`;
    // 设置选中的最后的元素位置索引
    endIndexNow = startIndex + 2;
  } else {
    let startTextContent = startElement.textContent;
    let endTextContent = endElement.textContent;
    // 如果已经是引用字符串则删除首尾符号，还原
    if (signRE.test(startTextContent) && signRE.test(endTextContent)) {
      // 删除选中的首行符号
      startElement.outerHTML = '';
      // 删除选中的最后一行符号
      endElement.outerHTML = '';
      // 设置选中的最后的元素位置索引
      endIndexNow = endIndex - 2;
    } else {
      // 在选中的首行前插入符号
      startElement.outerHTML = `<div>${sign}</div>${startElement.outerHTML}`;
      // 在选中的最后一行后插入符号
      endElement.outerHTML = `${endElement.outerHTML}<div>${sign}</div>`;
      // 设置选中的最后的元素位置索引
      endIndexNow = endIndex + 2;
    }
  }
  // 选中的首个元素
  startElementNow = container.children[startIndex];
  // 选中的首个元素的子元素位置
  startOffsetNow = 0;
  // 选中的最后一个元素
  endElementNow = container.children[endIndexNow];
  // 选中的最后一个元素的子元素位置
  endOffsetNow = container.children[endIndexNow].childNodes.length;
  // 调整选区
  range.setStart(startElementNow, startOffsetNow);
  range.setEnd(endElementNow, endOffsetNow);
}

/**
 * 处理行的插入
 * @param  {Object} options.range 代表选中文本的对象
 * @param  {Object} options.container 编辑区的容器元素
 * @param  {string} options.lines 插入的行
 */
function handleLineInsert({ range, container, lines }) {
  if (!isType(lines, 'Array')) return;
  // 选中的子元素及相关数据
  let { elements, startElement, startIndex } = getElementRange(range, container);
  let { startContainer, endContainer, startOffset, endOffset } = range;
  let beginingContent = startContainer.textContent.slice(0, startOffset);
  let endContent = endContainer.textContent.slice(endOffset);
  let lastIdx = lines.length - 1;
  let startOffsetNow = startOffset;
  let endOffsetNow = lines[lastIdx].length;

  lines[0] = beginingContent + lines[0];
  lines[lastIdx] = lines[lastIdx] + endContent;

  let lineHTML = covertToLineHTML(lines);
  // 如果选中多行，则需要先把选中的行删除，再插入
  elements.forEach((elm, index) => {
    // 保留第一行的原因是方便后续插入行
    if (index !== 0) {
      elm.parentNode.removeChild(elm);
    }
  });
  // 插入行
  startElement.outerHTML = lineHTML;

  let startElementNow = container.children[startIndex];
  let endElementNow = container.children[startIndex + lines.length - 1];

  if (startElementNow.childNodes[0]) {
    startElementNow = startElementNow.childNodes[0];
  } else {
    startOffsetNow = 0;
  }

  if (endElementNow.childNodes[0]) {
    endElementNow = endElementNow.childNodes[0];
  } else {
    endOffsetNow = 0;
  }
  // 调整选区
  range.setStart(startElementNow, startOffsetNow);
  range.setEnd(endElementNow, endOffsetNow);
}

/**
 * 获取编辑区中被选中的子元素集及相关数据
 * @param  {Object} range 代表选中区域的对象
 * @param  {Object} container 编辑容器元素
 * @return {Object} 编辑区中被选中的子元素及相关数据
 */
function getElementRange(range, container) {
  let elements, startElement, endElement, startIndex, endIndex;
  let children = [...container.children];
  // 如果选中的node的最近共同父元素为编程区容器，则证明选中的是多行
  if (range.commonAncestorContainer === container) {
    startElement = getFirstLevelElement(container, range.startContainer);
    endElement = getFirstLevelElement(container, range.endContainer);

    startIndex = children.indexOf(startElement);
    endIndex = children.indexOf(endElement);

    elements = children.slice(startIndex, endIndex + 1);
  } else {
    startElement = getFirstLevelElement(container, range.startContainer);
    endElement = startElement;
    startIndex = children.indexOf(startElement);
    endIndex = startIndex;
    elements = [startElement];
  }

  return {
    range,
    container,
    elements,
    startElement,
    endElement,
    startIndex,
    endIndex,
    singled: startIndex === endIndex
  };
}

/**
 * 获取最接近编辑容器元素的node的祖先元素
 * @param  {Object} container 编辑容器元素
 * @param  {Object} node
 * @return {Object} element 最接近编辑容器元素的node的祖先元素
 */
function getFirstLevelElement(container, node) {
  if (node.nodeType === 1 && node.parentNode && node.parentNode === container) {
    return node;
  } else {
    if (!node.parentNode) return null;

    return getFirstLevelElement(container, node.parentNode);
  }
}

/**
 * 根据传入的行列宽生成表示table表格的markdown文本的数组
 * @param  {number} options.row
 * @param  {number} options.col
 * @return {Array} lines
 */
function generateTableMDText({ row, col }) {
  if (!row || !col) return;

  let lines = [];

  for (let i = 0; i <= row; i++) {
    let str = '';
    let first, other;

    if (i === 1) {
      first = '|';
      other = ' --- |';
    } else {
      first = '|';
      other = '&nbsp;&nbsp;|';
    }

    for (let j = 0; j <= col; j++) {
      if (j === 0) {
        str = first;
      } else {
        str += other;
      }
    }

    lines.push(str);
  }

  return lines;
}

function covertToLineHTML(lines) {
  return lines.reduce((HTML, next) => {
    return HTML + `<div>${next}</div>`;
  }, '');
};