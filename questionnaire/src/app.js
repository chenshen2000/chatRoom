const express=require("express");
var app=express();
const http = require('http').Server(app);
var io = require('socket.io')(http, { cors: true });

const bodyParser = require('body-parser');
const mock=require("mockjs");
const md5=require("md5");
const fs=require("fs");

const router=require("./router/router.js");
const obfuscator=require("./utils/obfuscator.js");
const config=require("./config.js");

// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//public
app.use('/', express.static('./public'));

app.use(function(req,res,next){
    console.log("访问路径:"+req.url," ，时间："+new Date().toLocaleString());
    req.Mock=mock;
    req.md5=md5;
    req.fs=fs;
    req.obfuscator=obfuscator;
    req.config=config;
    res.setHeader("Access-Control-Allow-Methods", '*' );
    res.setHeader("Access-Control-Allow-Headers",'Content-Type, X-Custom-Header' );
    res.header('Access-Control-Allow-Origin',"*");
    next();
})

app.use(router);



http.listen(8888,()=>{
    console.log("listening.....");
})


// socket.io设置
// 在线用户
var onlineUsers = {}
 
var i = 0

io.on('connection', function (socket) {
  let {nickName,room,tt}=socket.handshake.query;
  console.log(room,"号房间",nickName,'已上线~~~');
  //监听新用户的加入
  socket.name = nickName+'-' + tt;
  if(!onlineUsers[room])
    onlineUsers[room]={};
  onlineUsers[room][socket.name]=socket;
  console.log(onlineUsers)
  // 监听用户退出
  socket.on('disconnect', function () {
    console.log(room,"号房间",nickName,'已退出......');
    delete onlineUsers[room][socket.name]
  })
 
  // 监听用户发布聊天内容
  socket.on('message', function (msg) {
    broadcast(msg, socket,room)
  })
})
 
function broadcast(msg, socket,room) {
  for (var key in onlineUsers[room]) {
    if(key==socket.name){
      continue;
    }
    onlineUsers[room][key].emit("message",socket.name.split("-")[0] + ' ::: ' + msg)
  }
}
