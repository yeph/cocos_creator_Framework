/*
 * @Author: jacklove
 * @Date: 2020-05-29 13:23:35
 * @LastEditTime: 2020-05-29 15:59:36
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\helper\gzip\PakoMgr.js
 */ 
let pako = require("pako.min")

module.exports = {
    // 解压
    unzip(b64Data) {
        var strData   = atob(b64Data);
        // Convert binary string to character-number array
        var charData  = strData.split('').map(function(x){return x.charCodeAt(0);});
        // Turn number array into byte-array
        var binData   = new Uint8Array(charData);
        // // unzip
        var data    = pako.inflate(binData);
        // Convert gunzipped byteArray back to ascii string:
        // strData   = String.fromCharCode.apply(null, new Uint16Array(data));
        var array = new Uint16Array(data)
        var res = '';
        var chunk = 8 * 1024;
        var i;
        for (i = 0; i < array.length / chunk; i++) {
           res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk)); 
          }
        res += String.fromCharCode.apply(null, array.slice(i * chunk));
      
        // strData = res
        return res;
    },
   
    // 压缩
    zip(str) {
        //escape(str)  --->压缩前编码，防止中午乱码
        var binaryString = pako.gzip(escape(str), { to: 'string' });
        return binaryString;
    },
};