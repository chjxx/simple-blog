const express = require('express');
const app = express();

// 预设请求过程中需要用到的变量
require('./kits/preset')(app);
// 配置传输数据压缩
require('./kits/compression')(app);
// 配置静态文件
require('./kits/wwwStatic')(app);
// 配置资源文件
require('./kits/assets')(app);
// 配置session
require('./kits/session')(app);
// 配置处理上传的表单数据
require('./kits/form')(app);
// 配置记录访问日志
require('./kits/logger')(app);
// 配置路由
require('./routes')(app);
// 配置记录错误信息
require('./kits/errorLogger')(app);
// 创建并启动服务器
require('./kits/server')(app);
