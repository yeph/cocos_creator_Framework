/*
 * @Author: jacklove
 * @Date: 2020-11-09 17:01:42
 * @LastEditTime: 2020-12-16 18:09:00
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\tool\InitTool.js
 */

console.log('Init uTool')

if (window.uTool == null) {
    window.uTool = {};  
}

import MD5 from './libs/md5';
uTool.md5 = MD5.md5;

// import UtilMgr from './tool/UtilMgr';
// uTool.UtilMgr = UtilMgr;

import base64 from './libs/base64';
uTool.Base64 = base64.Base64;

import IDCard from './custom/IDCard';
uTool.IDCard = IDCard;

//-------------------------- ToolCustom --------------------------//
import ToolCustom from './custom/ToolCustom';
uTool.UCustom = ToolCustom;

//-------------------------- ToolBase --------------------------//
import ToolBase from './core/ToolBase';
uTool.UBase = ToolBase;

uTool.encrypt = ToolBase.encrypt.bind(ToolBase);
uTool.decrypt = ToolBase.decrypt.bind(ToolBase);
uTool.createUUID = ToolBase.createUUID.bind(ToolBase);
uTool.autoScale = ToolBase.autoScale.bind(ToolBase);
uTool.curl_rand = ToolBase.curl_rand.bind(ToolBase);
uTool.curl_seed = ToolBase.curl_seed.bind(ToolBase);
uTool.curl_r2I = ToolBase.curl_r2I.bind(ToolBase);

//-------------------------- ToolNumber --------------------------//
import ToolNumber from './core/ToolNumber';
uTool.UNumber = ToolNumber;

uTool.r2I = ToolNumber.r2I.bind(ToolNumber);
uTool.numFixed = ToolNumber.numFixed.bind(ToolNumber);

//-------------------------- ToolTime --------------------------//
import ToolTime from './core/ToolTime';
uTool.UTime = ToolTime;

uTool.stampToTime = ToolTime.stampToTime.bind(ToolTime);
uTool.timeToString = ToolTime.timeToString.bind(ToolTime);
uTool.getTodayStamp = ToolTime.getTodayStamp.bind(ToolTime);
uTool.timeToHMS = ToolTime.timeToHMS.bind(ToolTime);

//-------------------------- ToolString --------------------------//
import ToolString from './core/ToolString';
uTool.UString = ToolString;

uTool.isChinese = ToolString.isChinese.bind(ToolString);
uTool.ch2Unicode = ToolString.ch2Unicode.bind(ToolString);
uTool.unicode2Ch = ToolString.unicode2Ch.bind(ToolString);
uTool.str2bytes = ToolString.str2bytes.bind(ToolString);