const router=require("express").Router();
//html页面显示
const page=require("./module/page.js")
const test=require("./module/test.js");
//问查调卷
const questionnaire=require("./module/questionnire.js");

router.use(page);
router.use(test);
router.use(questionnaire);

//404处理
router.use("*",function(req,res){
    res.status(404).send("404 not found!")
})

//错误处理中间件
router.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
  })


module.exports=router;