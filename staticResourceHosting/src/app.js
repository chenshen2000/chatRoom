const express = require('express');
const app = express();
const path = require('path');
const serveIndex = require('serve-index');

//----- 配置静态资源托管 -----
// 静态目录
app.use('/', serveIndex(path.join(__dirname, 'public'), {'icons': true}));
app.use('/', express.static(path.join(__dirname, 'public')));

//----- 监听端口 -----
const port = process.env.port || 3000;
app.listen(port, (error) => {
    console.log(`server running at port ${port}`);
});

