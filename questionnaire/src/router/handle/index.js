//权限处理
var arr=[{
    id:"97fd74aba46326712c54c1e2aa8bef16",
    //loop 循环，once 一次
    type:"once",
    // type:"loop",
    // url:'/questionnaire',
    // url:'/watching',
    // url:"/alert",
    // url:'/canvasPlayer',
    // url:'/billbill',
    url:"/deletePicture"


}];

//匹配对应权限
function match(id){
    return arr.findIndex(function(item){if(item.id==id) {return true;}});
}

/**
 * 
 * @param {数组下标} index 
 * @param {对象的键} key 
 * @returns 
 */
function getData(index,key){
    return arr[index][key];
}



module.exports={
    match,
    getData
}