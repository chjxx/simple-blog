const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  // 链接名
  name: {
    type: String,
    required: [true, '缺少链接名！']
  },
  // 链接地址
  link: {
    type: String,
    default: ''
  }
}, {
  versionKey: false
});

const bloginfoSchema = new Schema({
  // 管理员
  admin: [{
    type: Schema.Types.ObjectId,
    unique: true,
    ref: 'User'
  }],
  // 博客名
  name: {
    type: String,
    default: ''
  },
  // LOGO
  logo: {
    type: String,
    default: ''
  },
  // 博客有关信息
  about: {
    type: String,
    default: ''
  },
  // 友链
  blogroll: [linkSchema],
  // 联系方式
  contacts: [linkSchema],
  // 备案信息
  filling: [linkSchema],
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

/* created_at 和 updated_at 属性的更新 ---------------------------------- */
bloginfoSchema.pre('save', function() {
  let doc = this;

  return new Promise((resolve, reject) => {
    // 如果没有created_at属性，则判定为第一次创建。添加created_at属性
    if (!doc.created_at) doc.created_at = Date.now();

    doc.updated_at = Date.now();

    resolve();
  });
});

bloginfoSchema.pre('updateOne', function(next) {
  let doc = this._update;

  return new Promise((resolve, reject) => {
    doc.updated_at = Date.now();

    resolve();
  });
});

let Bloginfo = mongoose.model('Bloginfo', bloginfoSchema);

module.exports = Bloginfo;