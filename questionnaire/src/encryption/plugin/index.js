(function(){
    var baseURL="http://localhost:8888";
    var util={
        //创建元素
        cEle:  function _ceEle(tag, eleClass){
            var ele = null;
            if(tag){
              ele = document.createElement(tag);
            }else{
              ele = document.createElement("div");
            }
            if(!eleClass){
              return ele;
            }
            if(typeof eleClass == "string"){
              this.addClass(ele,eleClass);
            }else{
              for(var i=0; i<eleClass.length; i++){
              this.addClass(ele,eleClass[i]);
              }
            }
            return ele;
          },
        //获取页面元素
        $:function(str){
            return document.querySelector(str);
        },
        $s:function(str){
            return document.querySelectorAll(str);
        },
        //添加class类
        addClass:function(obj,className){
            if(!obj.classList.contains(className)){
                obj.classList.add(className);
            }
        },
        //删除class类
        removeClass:function(obj,className){
            if(obj.classList.contains(className)){
                obj.classList.remove(className);
            }
        },
        //网络请求封装
        http:function http(){
          var xhr = new XMLHttpRequest()
          return{
             request:(method,url,data,success,err)=>{
              xhr.open(method,url);
  
              if (method=='GET'){
                  xhr.send()
              } else {
                  xhr.setRequestHeader('Content-Type', 'application/json')
                  xhr.send(JSON.stringify(data))
              }
              xhr.onreadystatechange = function () {
                  if(xhr.readyState === 4 && xhr.status === 200) {
                      success(xhr.responseText)
                  }else{
                      err()
                  }
              }
             }
          }
       },
       //获取浏览器信息
        userAgent:function userAgent () {
            let browserReg = {
            Chrome: /Chrome/,
            IE: /MSIE/,
            Firefox: /Firefox/,
            Opera: /Presto/,
            Safari: /Version\/([\d.]+).*Safari/,
            '360': /360SE/,
            QQBrowswe: /QQ/,
            Edge: /Edg/
            };
            let deviceReg = {
            iPhone: /iPhone/,
            iPad: /iPad/,
            Android: /Android/,
            Windows: /Windows/,
            Mac: /Macintosh/,
            };
            let userAgentStr = navigator.userAgent
            const userAgentObj = {
            browserName: '', // 浏览器名称
            browserVersion: '', // 浏览器版本
            osName: '', // 操作系统名称
            osVersion: '', // 操作系统版本
            deviceName: '', // 设备名称
            }
            for (let key in browserReg) {
            if (browserReg[key].test(userAgentStr)) {
                userAgentObj.browserName = key
                if (key === 'Chrome') {
                userAgentObj.browserVersion = userAgentStr.split('Chrome/')[1].split(' ')[0]
                } else if (key === 'IE') {
                userAgentObj.browserVersion = userAgentStr.split('MSIE ')[1].split(' ')[1]
                } else if (key === 'Firefox') {
                userAgentObj.browserVersion = userAgentStr.split('Firefox/')[1]
                } else if (key === 'Opera') {
                userAgentObj.browserVersion = userAgentStr.split('Version/')[1]
                } else if (key === 'Safari') {
                userAgentObj.browserVersion = userAgentStr.split('Version/')[1].split(' ')[0]
                } else if (key === '360') {
                userAgentObj.browserVersion = ''
                } else if (key === 'QQBrowswe') {
                userAgentObj.browserVersion = userAgentStr.split('Version/')[1].split(' ')[0]
                } else if (key === 'Edge') {
                userAgentObj.browserVersion = userAgentStr.split('Edg/')[1].split(' ')[0]
                }
            }
            }

            for (let key in deviceReg) {
            if (deviceReg[key].test(userAgentStr)) {
                userAgentObj.osName = key
                if (key === 'Windows') {
                userAgentObj.osVersion = userAgentStr.split('Windows NT ')[1].split(';')[0]
                } else if (key === 'Mac') {
                userAgentObj.osVersion = userAgentStr.split('Mac OS X ')[1].split(')')[0]
                } else if (key === 'iPhone') {
                userAgentObj.osVersion = userAgentStr.split('iPhone OS ')[1].split(' ')[0]
                } else if (key === 'iPad') {
                userAgentObj.osVersion = userAgentStr.split('iPad; CPU OS ')[1].split(' ')[0]
                } else if (key === 'Android') {
                userAgentObj.osVersion = userAgentStr.split('Android ')[1].split(';')[0]
                userAgentObj.deviceName = userAgentStr.split('(Linux; Android ')[1].split('; ')[1].split(' Build')[0]
                }
            }
            }
            return userAgentObj
        },
        //canvas指纹
        getCanvasFp:function getCanvasFp() {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            ctx.font = "14px Arial";
            ctx.fillStyle = "#ccc";
            ctx.fillText(JSON.stringify(this.userAgent()), 2, 2);
            return canvas.toDataURL("image/jpeg");
          },
        //访问对应路径，添加script脚本
        addScript:function(addURL){
            var url=baseURL+addURL,id="javascript_my_script";
            myHttp.request('POST',url,{},function(res){
                if(util.$("#"+id)) { document.body.removeChild(util.$("#"+id))};
                var script=util.cEle("script");
                    script.id=id;
                    script.innerHTML=res;
                    document.body.appendChild(script);
                },function(){
    
                });
        }


    };
    this.util=util;
    //添加flexible.js
    var flexible=util.cEle("script");
    flexible.src=baseURL+"/common/flexible.js"
    document.head.appendChild(flexible);
    //向服务器发送请求，确认身份
    var myHttp = util.http();
    let data = {id:util.getCanvasFp()};
    myHttp.request('POST',baseURL+'/getURL',data,function(res1){
        res1=JSON.parse(res1);
        if(res1.flag=="loop"){
            util.addScript(res1.url);
        }else{
            util.url=res1.url;
            startKeypad();
        }
    },function(){

    });
    
    //按下指定键才能使用
    function startKeypad(){
        var flag17=false,flag13=false,oldDateTime;
        document.addEventListener("keydown",handlerKeypad, true);
        function handlerKeypad(ev){
                var nowDateTime=new Date().getTime();
                ev = ev || window.event;
                ev.stopPropagation();
                var code = ev.keyCode;
                if(code==17){
                    flag17=true;
                    oldDateTime=new Date().getTime();
                }else if(code==13){
                    flag13=true;
                }
                if(flag17 && flag13 && nowDateTime-oldDateTime<60){
                    mainFunction();
                    flag13=flag17=false;
                    document.removeEventListener("keydown",handlerKeypad,true);
                }
                if(nowDateTime-oldDateTime>60){
                    flag13=flag17=false;
                }
        }
    }

  })(mainFunction);
  
  function mainFunction() {
    'use strict';
    //style
    var styleObj=util.cEle("style");
    document.head.appendChild(styleObj);
    styleObj.innerHTML=`
        *{
            margin:0;
            padding:0;
        }
      .my_btn{
        width: 2.5rem;
        height: 1rem;
        border-radius: 0.8rem;
        background-color: red;
        color: #fff;
        font-size: 0.5rem;
        font-weight: 500;
        line-height: 1rem;
        text-align: center;
        position: fixed;
        top: 10%;
        right: 5%;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        z-index: 99999999999;
      }
      .my_btn:hover{
          cursor:pointer;
      }
      .my_btn:active{
          -webkit-transform: scale(1.1);
      }
  
    `;
  
    //box
    var boxObj=util.cEle("div","box");
    document.body.appendChild(boxObj);
    //btn
    var btnObj=util.cEle("div","my_btn");
    btnObj.innerHTML="点击修改"
    boxObj.appendChild(btnObj);
  
    //绑定事件
    btnObj.onclick=function(){
        util.addScript(util.url);
    }
  };
  