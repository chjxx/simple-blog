// 另外补这个polyfill是为了兼容IE

import 'formdata-polyfill';

// 库中的代码有用Symbol类型写了一个迭代器，但IE不支持Symbol类型，所以不能迭代.因此自己改了这个方法，将方法中的this改成this.entries()
FormData.prototype._blob = function() {
  const boundary = '----formdata-polyfill-' + Math.random();
  const chunks = [];
  for (const [name, value] of this.entries()) {
    chunks.push(`--${boundary}\r\n`);

    if (value instanceof Blob) {
      chunks.push(
        `Content-Disposition: form-data; name="${name}"; filename="${value.name}"\r\n`,
        `Content-Type: ${value.type || 'application/octet-stream'}\r\n\r\n`,
        value,
        '\r\n'
      );
    } else {
      chunks.push(
        `Content-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
      );
    }
  }

  chunks.push(`--${boundary}--`);
  return new Blob(chunks, {
    type: 'multipart/form-data; boundary=' + boundary
  });
};