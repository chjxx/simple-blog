const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  // 图片上传者
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // 标题
  title: {
    type: String,
    default: 'untitled'
  },
  // 说明
  notes: {
    type: String,
    default: ''
  },
  // 归属相册
  album: {
    type: String,
    default: ''
  },
  // 文件名
  filename: {
    type: String,
    required: [true, '未上传文件！']
  }
}, {
  versionKey: false
});

let Image = mongoose.model('Image', imageSchema);

module.exports = Image;