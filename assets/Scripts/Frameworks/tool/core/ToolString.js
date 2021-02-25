/*
 * @Author: jacklove
 * @Date: 2020-11-09 16:58:36
 * @LastEditTime: 2020-11-09 17:56:14
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\tool\core\ToolString.js
 */

String.prototype.format = function(args) { 
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ''; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else { 
        return this;
    } 
};

module.exports = {

    randCh(num = 1)
    {
        var result = '';
        for (let i = 0; i < num; i++) {
            var rand = this.random2Int(0x4e00, 0x9fa5);
            result += String.fromCharCode(rand.toString(10));
        }
        return result;
    },

    isChinese(s)
    {
        return /[\u4e00-\u9fa5]/.test(s);
    },

    ch2Unicode(str)
    {
        if(!str){
            return;
        }
        var unicode = '';
        for (var i = 0; i <  str.length; i++) {
            var temp = str.charAt(i);
            if(this.isChinese(temp)){
                unicode += '\\u' +  temp.charCodeAt(0).toString(16);
            }
            else{
                unicode += temp;
            }
        }
        
	    return unicode;
    },

    unicode2Ch(str)
    {
        if(!str){
            return;
        }
        // 控制循环跃迁
        var len = 1;
        var result = '';
            // 注意，这里循环变量的变化是i=i+len 了
        for (var i = 0; i < str.length; i=i+len) {
            len = 1;
            var temp = str.charAt(i);
            if(temp == '\\'){
                // 找到形如 \u 的字符序列
                if(str.charAt(i+1) == 'u'){
                    // 提取从i+2开始(包括)的 四个字符
                    var unicode = str.substr((i+2),4); 
                                    // 以16进制为基数解析unicode字符串，得到一个10进制的数字
                    result += String.fromCharCode(parseInt(unicode,16).toString(10));
                    // 提取这个unicode经过了5个字符， 去掉这5次循环
                    len = 6;
                }
                else{
                    result += temp;
                }
            }
            else{
                result += temp;
            }
        }
        return result;
    },

    str2bytes(str)
    {
        var bytes = [];
        for (var i = 0, len = str.length; i < len; ++i) {
             var c = str.charCodeAt(i);
             var byte = c & 0xff;
             bytes.push(byte);
        }    
        return bytes;
    },
    
};