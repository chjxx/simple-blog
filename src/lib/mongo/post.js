const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // 作者
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '缺少文章作者！'],
    index: 1
  },
  // 标题
  title: {
    type: String,
    match: [/.{6,100}/, '标题格式有误！'],
    required: [true, '缺少文章标题！']
  },
  // 命名链接
  namedLink: {
    type: String,
    match: [/\w{6,100}/, '命名链接格式有误！']
  },
  // 封面
  cover: {
    type: String,
    default: ''
  },
  // 描述
  describe: {
    type: String,
    default: ''
  },
  // 内容
  content: {
    type: String,
    minlength: [10, '内容格式有误！'],
    required: [true, '缺少文章内容！']
  },
  // 标签
  tags: [
    {
      type: String,
      validate: {
        validator: tagValidator,
        message: '标签格式有误！'
      }
    }
  ],
  // 状态
  state: {
    type: String,
    enum: {
      values: ['published', 'editing'],
      message: '状态不合法！'
    },
    default: 'published',
    index: 1
  },
  // 浏览量
  pv: {
    type: Number,
    default: 0
  },
  // 创建时间
  created_at: {
    type: Number
  },
  // 最后修改时间
  updated_at: {
    type: Number
  }
}, {
  versionKey: false
});

// // 建立搜索索引
// postSchema.index({
//   title: 'text',
//   content: 'text',
//   tags: 'text'
// });

/* created_at 和 updated_at 属性的更新 ---------------------------------- */
postSchema.pre('save', function() {
  let doc = this;

  return new Promise((resolve, reject) => {
    if (!doc.created_at) {
      doc.created_at = Date.now();
    }

    doc.updated_at = Date.now();

    resolve();
  });
});

postSchema.pre('updateOne', function() {
  let doc = this._update;

  return new Promise((resolve, reject) => {
    doc.updated_at = Date.now();

    resolve();
  });
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;

function tagValidator(tag) {
  // 匹配 "\ / ' "  # : * ? < > | 空格"等字符
  const Pattern = /[\\\/'"#:\*\?\<\>\| ]/;
  return !Pattern.test(tag);
}
