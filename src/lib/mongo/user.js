const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 用户名
  name: {
    type: String,
    unique: true,
    required: [true, '缺少用户名！'],
    match: [/^[a-zA-Z][\w]{4,11}$/, '用户名不合法！'],
    trim: true,
    index: 1
  },
  // 邮箱
  email: {
    type: String,
    unique: true,
    required: [true, '缺少用户邮箱！'],
    match: [/^[\w]+@[\w]+\.[\w]+$/, '用户邮箱不合法!'],
    trim: true,
    index: 1
  },
  // 密码
  password: {
    type: String,
    required: [true, '缺少用户密码！']
  },
  // 头像
  avatar: {
    type: String,
    required: [true, '缺少用户头像！']
  },
  // 性别
  gender: {
    type: String,
    enum: {
      values: ['x', 'm', 'f'],
      message: '用户性别不合法！'
    },
    default: 'x'
  },
  // 个人简介
  bio: {
    type: String,
    default: ''
  },
  // 账户创建时间
  created_at: {
    type: Number
  }
}, {
  versionKey: false
});

// 第一次保存填充created_at
userSchema.pre('save', function(next) {
  if (!this.created_at) this.created_at = Date.now();

  next();
});

let User = mongoose.model('User', userSchema);

module.exports = User;