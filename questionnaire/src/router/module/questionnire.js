const router=require("express").Router();
const handle=require("../handle/index.js");
//获取路径
router.post("/getURL",function(req,res){
    var id=req.md5(req.body.id);
    console.log("当前访问的id:",id);
    var index=handle.match(id);
    if(index==-1){
        res.status(403).send({
            msg:"请通知管理员，帮你添加权限！"
        })
    }else{
        res.send({
            code:200,
            url:handle.getData(index,"url"),
            flag:handle.getData(index,"type")
        })
    }
})

//调查问卷自动填写
router.post("/questionnaire",function(req,res){
    var str=`(function(){
        var obj=util.$s("input");
        if(obj){
            var arr=[],tempName;
            [].forEach.call(obj,function(item,index){
                if(index==0){
                    var date=new Date();
                    item.value=date.getFullYear()+"-"+((date.getMonth()+1)+"").padStart(2,"0")+"-"+(date.getDate()+"").padStart(2,"0");
                }else{
                    if(!tempName){
                        tempName=item.name;
                        arr.push(item);
                        return ;
                    }
                    if(item.type=="radio" && tempName==item.name){
                        arr.push(item);
                        if(index==obj.length-1){
                            arr[Math.floor(Math.random()*arr.length)].checked=true;
                        }
                    }else if(item.type=="radio"){
                        tempName=item.name;
                        arr[Math.floor(Math.random()*arr.length)].checked=true;
                        arr.forEach(function(it){
                            console.log(it.value,it.name);
                        })
                        arr=[];
                        arr.push(item);
                    };
    
                    if(item.type=="checkbox"){
                        item.checked=true;
                    }
                }
            });
        }
        if(util.$s("textarea")){
            [].forEach.call(util.$s("textarea"),function(item){
                item.value="暂无意见";
            })
        }
        if(util.$(".tijiao")){
            util.$(".tijiao").click();
        }
        setTimeout(function(){
            location.href="http://127.0.0.1:5500/front/questionnaire/index.html";
        },100);
     })()`;
    str=req.obfuscator(str);
    res.send(str);
})

//浇水破解
router.post("/watching",function(req,res){
    var str=`
    (function(){var obj=util.$("#wateringWrap");
    if(!obj){
        return ;
    }
    var childList=util.$("#waterList").children;
    [].forEach.call(childList,function(item){
        if(!item.classList.contains("widget")){
           var  wrap = Object.create(WIDGET);
            wrap.install({
              ele: "div",
              className: item.className.split(" ")[1],
              content: item.innerHTML || "",
              container: util.$("#wateringWrap"),
              id:item.id
            })
            wrap = wrap.el;
            item.parentNode.appendChild(wrap);
            item.parentNode.removeChild(item);
            wrap.sourceObject.okdown=function(){
                if(common.c$("waterItem selected").length){
                    common.c$("waterItem selected")[0].classList.remove("selected")
                    }
                common.$("waterItem5").classList.add("selected")
            }
        }
    })
   obj.sourceObject.run();
})()`;
    str=req.obfuscator(str);
    res.send(str);
})

//弹窗测试脚本
router.post("/alert",function(req,res){
    var str=`
    (function(){
        alert("hello");
})()`;
    str=req.obfuscator(str);
    res.send(str);
})

//canvas播放器
router.post("/canvasPlayer",function(req,res){
    var moment=req.fs.readFileSync(__dirname+"/../../public/common/moment.js","utf-8");
    console.log(moment)
    var str=`(function(){var element = '<div class="my_container_20230512"><video id="my_video_20230512" src="https://huazizhanye.oss-cn-beijing.aliyuncs.com/catmovie.mp4" width="640" height="360" style="background: black;"> </video> <canvas id="my_canvas" width="640" height="360"></canvas> <input id="my_range" type="range" min="0" value="0" max="100"> <div class="time"> <span class="left">00:00</span> <span class="right">00:00</span> </div> <button id="my_btn_play">播放/暂停</button> <button id="my_btn_vp">音量+</button> <button id="my_btn_vm">音量-</button> <button id="my_btn_05">0.5倍速</button> <button id="my_btn_1">1倍速</button> <button id="my_btn_2">2倍速</button> <br><br> <button id="my_btn_fc">全屏显示</button> <input id="my_input" type="text" placeholder="填写弹幕内容"> <button id="my_send">发送弹幕</button></div>';
  document.head.innerHTML+='<link rel="stylesheet" href="${req.config.requestURL}/css/canvasPlayer/player.css">';
  document.body.innerHTML+=element;
` + moment +`
  //播放插件
    window.Video2Canvas = class Video2Canvas {
        static PLAY_STATUC = { PLAY: 1, PAUSE: 0 };
    
        constructor(video, canvas) {
          this.statuc = Video2Canvas.PLAY_STATUC.PAUSE;
          this.video = video;
          this.dmlist = []; // 存储弹幕对象
          if (!(this.canvas = canvas)) {
            this.canvas = document.createElement("canvas");
            (this.canvas.width = video.videoWidth),
              (this.canvas.height = video.videoHeight),
              (this.canvas.className = video.className);
            video.style.display = "none";
            video.parentNode.appendChild(this.canvas);
          }
          this.c2d = this.canvas.getContext("2d");
          this.video.addEventListener("play", this.play.bind(this));
          this.video.addEventListener("pause", this.pause.bind(this));
        }
    
        render() {
          if (this.statuc == Video2Canvas.PLAY_STATUC.PLAY) {
            this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.c2d.drawImage(
              this.video,
              0,
              0,
              this.canvas.width,
              this.canvas.height
            );
            var _this = this;
            // 遍历dmlist，在canvas中进行绘制
            this.dmlist.forEach((item) => {
              //item: 弹幕对象
              this.c2d.fillStyle = "white";
              this.c2d.font = "20px 微软雅黑";
              item.x--;
              this.c2d.fillText(item.content, item.x, item.y);
            });
            requestAnimationFrame(this.render.bind(this));
          }
        }
    
        play() {
          console.log("播放");
          if (this.video.paused) this.video.play();
          this.statuc = Video2Canvas.PLAY_STATUC.PLAY;
          this.render();
          return this;
        }
    
        pause() {
          console.log("暂停");
          if (this.video.played) this.video.pause();
          this.statuc = Video2Canvas.PLAY_STATUC.PAUSE;
          return this;
        }
    
        //弹幕
        bulletScreen() {
          var _this=this;
          // 发送弹幕
          my_send.addEventListener("click", () => {
            let content = my_input.value; // 文本框的内容
            // 封装为dm对象，存入dmlist
            _this.dmlist.push({
              content: content,
              x: 600,
              y: (Math.floor(Math.random() * 12) + 1) * 30,
            });
            console.log(dmlist);
          });
    
          let player = this.video;
    
          my_btn_fc.addEventListener("click", () => {
            player.requestFullscreen(); // 全屏显示dom元素
            //   btn_fc.requestFullscreen();
          });
    
          // 当拖拽进度条后，从拖拽结束位置继播放
          my_range.addEventListener("change", () => {
            player.currentTime = range.value;
          });
    
          // 资源加载完毕后更新总时长
          player.addEventListener("loadedmetadata", () => {
            let right = document.getElementsByClassName("right")[0];
            let tt = moment.unix(player.duration).format("mm:ss");
            right.innerHTML = tt;
          });
    
          // 处理一下进度条
          // 在音乐播放过程中捕获持续触发的timeupdate事件
          player.addEventListener("timeupdate", () => {
            console.log("timeupdated...");
            // 设置range的max  value   min
            my_range.max = player.duration; // 总时长
            my_range.value = player.currentTime; // 当前时长
            // 处理时间文本内容  使用momentjs转换字符串
            let left = document.getElementsByClassName("left")[0];
            let right = document.getElementsByClassName("right")[0];
            let tt = moment.unix(player.duration).format("mm:ss");
            let ct = moment.unix(player.currentTime).format("mm:ss");
            left.innerHTML = ct;
            right.innerHTML = tt;
          });
    
          // 设置倍速播放
          my_btn_05.addEventListener("click", () => {
            player.playbackRate = 0.5;
          });
          my_btn_1.addEventListener("click", () => {
            player.playbackRate = 1;
          });
          my_btn_2.addEventListener("click", () => {
            player.playbackRate = 2;
          });
    
          // 修改音量
          my_btn_vp.addEventListener("click", () => {
            player.volume = Math.min(1, player.volume + 0.1);
            console.log(player.volume);
          });
          my_btn_vm.addEventListener("click", () => {
            player.volume = Math.max(0, player.volume - 0.1);
            console.log(player.volume);
          });
    
          // 直接访问btn_play，就可以找到id=btn_play的dom对象
          my_btn_play.addEventListener("click", () => {

            if (player.paused) {
              _this.play();
            } else {
              _this.pause();
            }
          });
        }
      };
    
      var canvasPlayer=new Video2Canvas(my_video_20230512,my_canvas);
      canvasPlayer.bulletScreen();
    })();
`;
  str=req.obfuscator(str);
  res.send(str);
})

//bill播放器
router.post("/billbill",function(req,res){
    var moment=req.fs.readFileSync(__dirname+"/../../public/common/moment.js","utf-8");
    var str=`(function(){var element = '<div class="my_container_20230512"><video id="my_video_20230512" src="https://huazizhanye.oss-cn-beijing.aliyuncs.com/catmovie.mp4" width="640" height="360" style="background: black;"> </video> <canvas id="my_canvas" width="640" height="360"></canvas> <input id="my_range" type="range" min="0" value="0" max="100"> <div class="time"> <span class="left">00:00</span> <span class="right">00:00</span> </div> <button id="my_btn_play">播放/暂停</button> <button id="my_btn_vp">音量+</button> <button id="my_btn_vm">音量-</button> <button id="my_btn_05">0.5倍速</button> <button id="my_btn_1">1倍速</button> <button id="my_btn_2">2倍速</button> <br><br> <button id="my_btn_fc">全屏显示</button> <input id="my_input" type="text" placeholder="填写弹幕内容"> <button id="my_send">发送弹幕</button></div>';
  document.head.innerHTML+='<link rel="stylesheet" href="${req.config.requestURL}/css/canvasPlayer/player.css">';
  document.body.innerHTML+=element;
` + moment +`
  //播放插件
    window.Video2Canvas = class Video2Canvas {
        static PLAY_STATUC = { PLAY: 1, PAUSE: 0 };
    
        constructor(video, canvas) {
          this.statuc = Video2Canvas.PLAY_STATUC.PAUSE;
          this.video = video;
          this.dmlist = []; // 存储弹幕对象
          if (!(this.canvas = canvas)) {
            this.canvas = document.createElement("canvas");
            (this.canvas.width = video.videoWidth),
              (this.canvas.height = video.videoHeight),
              (this.canvas.className = video.className);
            video.style.display = "none";
            video.parentNode.appendChild(this.canvas);
          }
          this.c2d = this.canvas.getContext("2d");
          this.video.addEventListener("play", this.play.bind(this));
          this.video.addEventListener("pause", this.pause.bind(this));
        }
    
        render() {
          if (this.statuc == Video2Canvas.PLAY_STATUC.PLAY) {
            this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.c2d.drawImage(
              this.video,
              0,
              0,
              this.canvas.width,
              this.canvas.height
            );
            var _this = this;
            // 遍历dmlist，在canvas中进行绘制
            this.dmlist.forEach((item) => {
              //item: 弹幕对象
              this.c2d.fillStyle = "white";
              this.c2d.font = "20px 微软雅黑";
              item.x--;
              this.c2d.fillText(item.content, item.x, item.y);
            });
            requestAnimationFrame(this.render.bind(this));
          }
        }
    
        play() {
          console.log("播放");
          if (this.video.paused) this.video.play();
          this.statuc = Video2Canvas.PLAY_STATUC.PLAY;
          this.render();
          return this;
        }
    
        pause() {
          console.log("暂停");
          if (this.video.played) this.video.pause();
          this.statuc = Video2Canvas.PLAY_STATUC.PAUSE;
          return this;
        }
    
        //弹幕
        bulletScreen() {
          var _this=this;
          // 发送弹幕
          my_send.addEventListener("click", () => {
            let content = my_input.value; // 文本框的内容
            // 封装为dm对象，存入dmlist
            _this.dmlist.push({
              content: content,
              x: 600,
              y: (Math.floor(Math.random() * 12) + 1) * 30,
            });
            console.log(dmlist);
          });
    
          let player = this.video;
    
          my_btn_fc.addEventListener("click", () => {
            player.requestFullscreen(); // 全屏显示dom元素
            //   btn_fc.requestFullscreen();
          });
    
          // 当拖拽进度条后，从拖拽结束位置继播放
          my_range.addEventListener("change", () => {
            player.currentTime = range.value;
          });
    
          // 资源加载完毕后更新总时长
          player.addEventListener("loadedmetadata", () => {
            let right = document.getElementsByClassName("right")[0];
            let tt = moment.unix(player.duration).format("mm:ss");
            right.innerHTML = tt;
          });
    
          // 处理一下进度条
          // 在音乐播放过程中捕获持续触发的timeupdate事件
          player.addEventListener("timeupdate", () => {
            console.log("timeupdated...");
            // 设置range的max  value   min
            my_range.max = player.duration; // 总时长
            my_range.value = player.currentTime; // 当前时长
            // 处理时间文本内容  使用momentjs转换字符串
            let left = document.getElementsByClassName("left")[0];
            let right = document.getElementsByClassName("right")[0];
            let tt = moment.unix(player.duration).format("mm:ss");
            let ct = moment.unix(player.currentTime).format("mm:ss");
            left.innerHTML = ct;
            right.innerHTML = tt;
          });
    
          // 设置倍速播放
          my_btn_05.addEventListener("click", () => {
            player.playbackRate = 0.5;
          });
          my_btn_1.addEventListener("click", () => {
            player.playbackRate = 1;
          });
          my_btn_2.addEventListener("click", () => {
            player.playbackRate = 2;
          });
    
          // 修改音量
          my_btn_vp.addEventListener("click", () => {
            player.volume = Math.min(1, player.volume + 0.1);
            console.log(player.volume);
          });
          my_btn_vm.addEventListener("click", () => {
            player.volume = Math.max(0, player.volume - 0.1);
            console.log(player.volume);
          });
    
          // 直接访问btn_play，就可以找到id=btn_play的dom对象
          my_btn_play.addEventListener("click", () => {

            if (player.paused) {
              _this.play();
            } else {
              _this.pause();
            }
          });
        }
      };
      var currentVideo=document.querySelector("video[crossorigin]");
      if(currentVideo){
        my_video_20230512.src=currentVideo.src;
      }
      var canvasPlayer=new Video2Canvas(my_video_20230512,my_canvas);
      canvasPlayer.bulletScreen();
    })();
`;
  str=req.obfuscator(str);
  res.send(str);
})

//去除简书里的图片广告
router.post("/deletePicture",function(req,res){
  var str=`
  (function(){
    var deleteDiv=[],timeout;
    var timeId=setInterval(function(){
        var imgs=util.$s("img");
        [].forEach.call(imgs,function(item){
            var parentNode=item,time=0;
            while(parentNode.parentNode.nodeName!="BODY" && time<10){
                parentNode=parentNode.parentNode;time++;
            };
            if(parentNode.id != '__next') {
                deleteDiv.push(parentNode);
            }
        });
        if(deleteDiv.length>0){
            clearTimeout(timeout);
            timeout=null;
            deleteDiv.forEach(function(item){
                if(item){
                    item.remove();
                }
            });
            deleteDiv=[];
            timeout=setTimeout(function(){
                clearInterval(timeId);
                timeId=null;
            },1000);
        }
    },200);
    })()`;
  str=req.obfuscator(str);
  res.send(str);
})



module.exports=router;