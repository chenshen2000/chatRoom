const router=require("express").Router();
const formidable = require('formidable');



router.get("/chatRoom/:room",function(req,res){
    var html=req.fs.readFileSync(__dirname+"/../../public/page/chatRoom/newRoom.html","utf-8");
    html=html.replace(/(\$|\u201d)(\#|\u201c)name(\#|\u201c)(\$|\u201d)/g,req.query.nickName);
    html=html.replace(/(\$|\u201d)(\#|\u201c)room(\#|\u201c)(\$|\u201d)/g,req.params.room);
    html=html.replace(/(\$|\u201d)(\#|\u201c)requestURL(\#|\u201c)(\$|\u201d)/g,req.config.requestURL);
    res.send(html);
})

router.get("/login",function(req,res){
  var html=req.fs.readFileSync(__dirname+"/../../public/page/chatRoom/login.html","utf-8");
  html=html.replace(/(\$|\u201d)(\#|\u201c)requestURL(\#|\u201c)(\$|\u201d)/g,req.config.requestURL);
  res.send(html);
})

router.post("/login",function(req,res){
    var {nickName,password,room}=req.body;
    var random=!!room?room:Math.ceil(Math.random()*10);
    if(password=="test-88888888"){  
        res.send("/chatRoom/"+random+"?nickName="+nickName);
    }else{
        res.send("/login?lastLogin=false");
    }
})


//上传文件
router.post("/upload",function(req,res){
    var message = '';
    var form = new formidable.IncomingForm();   //创建上传表单
        form.encoding = 'utf-8';        //设置编辑
        form.uploadDir = 'public/upload/';     //设置上传目录
        form.keepExtensions = true;     //保留后缀
        // form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    
    form.parse(req, function(err, fields, files) {
        if (err) {
        console.log(err);
        }   
        console.log(files)
        var filename = files.file.name;
    
        // 对文件名进行处理，以应对上传同名文件的情况
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length-1];
        var name = '';
        for(var i=0; i<nameArray.length-1; i++){
            name = name + nameArray[i];
        }
        var rand = Math.random()*100 + 900;
        var num = parseInt(rand, 10);
    
        var avatarName = name + num +  '.' + type;
    
        var newPath = form.uploadDir + avatarName ;
        req.fs.renameSync(files.file._writeStream.path, newPath);  //重命名
        res.send({
            code:200,
            message:"ok"
        })
    });
})

//下载文件
router.get("/download/:name",function(req,res){

  var filepath=__dirname+"/../../public/upload/"+req.params.name;
  var filename=req.params.name;
  // filename:设置下载时文件的文件名，可不填，则为原名称
  res.download(filepath, filename);
})






module.exports=router;