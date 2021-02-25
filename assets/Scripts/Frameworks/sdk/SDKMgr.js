/*
 * @Author: jacklove
 * @Date: 2019-12-21 11:05:49
 * @LastEditTime: 2020-11-30 15:35:57
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\sdk\SDKMgr.js
 */

let Wechat = require("Wechat")
let TTAd = require("TTAd")

module.exports = {
    USDK_API : 'uSDK',
    USDKMGR_API : 'uSDK/SDKManager',
    UTOOl_API : 'uSDK/tools/ToolUtil',
    COCOS_API : 'org/cocos2dx/javascript/AppActivity',
    WECHAT_API : 'uSDK/apis/wechat/WeChat',
    TTAD_API : 'uSDK/apis/ttad/TTAd',
    TALK_API : 'uSDK/apis/talkingdata/TalkData',
    OPENINS_API : 'uSDK/apis/openInstall/OpenIns',

    sdk_map : new Object(),

    init()
    {
        this.sdk_map = new Object();
        this.pushSDK(Wechat);
        this.pushSDK(TTAd);
    },

    pushSDK(clsName)
    {
        var obj = new clsName();
        obj.init();
        this.sdk_map[obj.sdk_name] = obj;
    },

    getSDK(name)
    {
        return this.sdk_map[name];
    },

    listen(type, callback, cls, priority = 0) 
    {
        unit.EventMgr.listen_s('__SDKMgr__', type, callback, cls, priority);
    },

    dispatch(type, data)
    {
        unit.EventMgr.dispatch_s('__SDKMgr__', type, data);
    },

    callMethod(class_name, method_name, return_name, ...params)
    {
        var value = unit.PlatformHelper.callStaticMethod(class_name, method_name, return_name, ...params);
        return value;
    },

    callIOS(class_name, method_name, params)
    {
        return unit.PlatformHelper.callIOSMethod(class_name, method_name, params);
    },

    onRegisterCallback(method_name, return_name, callback_method)
    {
        unit.PlatformHelper.callStaticMethod(this.UTOOl_API, 'registerCall', return_name, method_name, callback_method);
    },

    // Cocos工具方法
    callCocosMethod(method_name, return_name, ...params)
    {
        return this.callMethod(this.COCOS_API, method_name, return_name, ...params);
    },

    // 工具方法
    callToolMethod(method_name, return_name, ...params)
    {
        return this.callMethod(this.UTOOl_API, method_name, return_name, ...params);
    },

    //-------------------------------- 自定义方法 --------------------------------//
    // 微信方法
    callWechatMethod(method_name, return_name, ...params)
    {
        return this.callMethod(this.WECHAT_API, method_name, return_name, ...params);
    },

    // ttad方法
    callTTADMethod(method_name, return_name, ...params)
    {
        return this.callMethod(this.TTAD_API, method_name, return_name, ...params);
    },
};

// module.exports.__init__();