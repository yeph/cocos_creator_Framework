/*
 * @Author: jacklove
 * @Date: 2020-07-30 13:27:49
 * @LastEditTime: 2020-07-31 11:05:08
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\view\MVBase.js
 */ 
cc.Class({
    // extends: cc.Component,

    name : 'MVBase',

    properties: {
        bindNode:
        {
            default: null,
            type : cc.Node,
            tooltip : '绑定节点',
            readonly : true,
        },
        watchPathArr :
        {
            default: [],
            type : [cc.String],
            tooltip : '监听数据路径列表',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initEditMode(...params)
    {
        if (params.length <= 0) {
            console.error('MVLabel init error');
            return;
        }
        this.bindNode = params[0];
    },

    init(...params)
    {

    },

    handleData(data)
    {

    },
});
