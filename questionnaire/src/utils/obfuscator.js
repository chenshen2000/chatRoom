var JavaScriptObfuscator = require('javascript-obfuscator');


//混淆压缩obfuscator
function myObfuscator(str){
    var obfuscationResult = JavaScriptObfuscator.obfuscate(
        str,
        {
            //压缩代码到一行
            compact: false,
            //是否开启平展控制流。此选项对性能的影响最大为运行速度降低1.5倍。 使用controlFlowFlatteningThreshold设置将受控制流展平影响的节点的百分比。
            //平展控制流是源代码的结构转换，让代码变得难以阅读。
            controlFlowFlattening: true,
            /**
             * 每个节点采用平展控制流的概率，该参数主要用来优化大代码的性能和代码大小。大量的平展控制流会是代码运行效率变差而且代码增大。
                设置为0表示关闭平展控制流
             */
            controlFlowFlatteningThreshold: 1,
            //允许将数字转换为表达式
            numbersToExpressions: true,
            //简化多余的代码
            simplify: true,
            //随机打乱stringArray数组元素，stringArray设置为true时启用
            shuffleStringArray: true,
            //将字符串拆分字符串块。
            splitStrings: true,

            stringArrayThreshold: 1
        }
    );
    return obfuscationResult.getObfuscatedCode();
}

module.exports=myObfuscator;
