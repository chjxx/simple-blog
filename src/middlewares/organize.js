const path = require('path');
const f = require('../lib/file');
const { isType, notType, copyFields, parseJSONFields, checkPropertyType, sameArrayVal } = require('../lib/utils');
const { ParamTypeError, MiddlewareError } = require('../lib/ExtendError');

// 组织字段的中间件
exports.organizeField = options => {
  let paramError = checkPropertyType({ options }, {
    options: 'Object',
    'options.key': {
      expected: 'String',
      test: () => isType(options.key, 'String') && options.key.length !== 0
    },
    'options.fields': 'Undefined|Array',
    'options.files': 'Undefined|Array',
    'options.arrayFields': 'Undefined|Array'
  });

  if (paramError) {
    throw new ParamTypeError(paramError);
  }

  let { key, fields, files, arrayFields } = options;

  return (req, res, next) => {
    let result = {};

    if (fields) {
      copyFields(req.fields, fields, result);
    }

    if (arrayFields) {
      try {
        parseJSONFields(result, arrayFields);
      } catch (err) {
        return next(new MiddlewareError('字段值不合法！'));
      }
    }

    if (files) {
      files.forEach(key => {
        if (req.files[key]) {
          result[key] = path.parse(req.files[key].path).base;
        }
      });
    }

    req.locals[key] = result;

    return next();
  };
};

// 组织上传的图片信息的中间件
exports.organizeImageCreateFields = (req, res, next) => {
  let info;

  // 处理图片信息数据
  try {
    info = JSON.parse(req.fields.info);

    if (notType(info, 'Array')) {
      throw new Error('图片信息格式不合法！');
    }
  } catch (err) {
    // 如果图片信息加载错误
    deleteImages(req.files);

    return next(new MiddlewareError('图片信息格式不合法！'));
  }

  let fileKeys = Object.keys(req.files);
  // 比对图片信息与上传的图片的数量
  if (fileKeys.length !== info.length) {
    // 如果图片信息加载错误
    deleteImages(req.files);

    return next(new MiddlewareError('图片信息不完整！'));
  }

  let infoFileNames = info.map(i => i.filename);
  let fileFileNames = fileKeys.map(key => req.files[key].name);
  // 比如图片信息的一致性
  if (!sameArrayVal(infoFileNames, fileFileNames)) {
    // 如果图片信息加载错误
    deleteImages(req.files);

    return next(new MiddlewareError('图片信息不完整！'));
  }
  // 给信息加上所有者
  info.forEach(image => {
    image.owner = req.session.user._id;
  });
  // 补全信息
  for (let i = info.length - 1; i >= 0; i--) {
    let image = info[i];
    let key = Object.keys(req.files).find(key => req.files[key].name === image.filename);

    image.uploadname = image.filename;
    image.filename = path.parse(req.files[key].path).base;
  }

  req.locals.info = info;

  return next();

  function deleteImages(files) {
    Object.keys(files).forEach(key => {
      f.delete(files[key].path);
    });
  }
};