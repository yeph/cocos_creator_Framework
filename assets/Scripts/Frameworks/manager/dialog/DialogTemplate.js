/*
 * @Author: jacklove
 * @Date: 2020-11-03 16:20:27
 * @LastEditTime: 2020-11-11 13:44:59
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\manager\dialog\DialogTemplate.js
 */

let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    stateEvent(eventid)
    {

    },

    // update (dt) {},
});
