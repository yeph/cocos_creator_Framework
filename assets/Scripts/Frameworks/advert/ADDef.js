/*
 * @Author: jacklove
 * @Date: 2020-11-26 16:21:06
 * @LastEditTime: 2020-12-17 17:53:52
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\advert\ADDef.js
 */
module.exports = {

    // PLATFROM Model
    MODULE_TYPE : cc.Enum({
        UNKNOW : 0,

        // Android 原生视频
        ANDROID_TT : 1,

        // ios 原生视频
        IOS_TT : 1001,

        // 小游戏视频
        MINI_QQ : 2001,
        MINI_WX : 2002,
        MINI_BYTEDANCE : 2003,               // 神隐模式
    }),

    tt_android : 'tt_android',
    qq_mini : 'qq_mini',
    wechat_mini : 'wechat_mini',
    bytedance_mini : 'bytedance_mini',
    vivo_mini : 'vivo_mini',

    AD_EVENT : {
        AD_REWARD : 'ad_reward',
    },
}