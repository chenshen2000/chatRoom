const router=require("express").Router();
var infoList=[];
router.post("/getQuestionnireInfo",function(req,res){
    infoList.push(req.body);
    req.fs.writeFileSync(__dirname+"/../../public/info.json",JSON.stringify(infoList));
    res.send("OK!")
})

router.get("/test",function(req,res){
    var data=req.Mock.mock({
        'list|1':[{
            'id|+1':1,
            'name':"@cname",
            'description|3-5':"@csentence",
            'area':'@province'
        }]
    })
    res.send({
        msg:"success",
        data,
        code:200
    })
})


module.exports=router;