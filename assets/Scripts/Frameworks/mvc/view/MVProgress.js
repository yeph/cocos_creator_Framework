/*
 * @Author: jacklove
 * @Date: 2020-07-31 16:48:29
 * @LastEditTime: 2020-07-31 16:56:52
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\view\MVProgress.js
 */ 
let MVBase = require('./MVBase')

cc.Class({
    extends: MVBase,
    name : 'MVProgress',

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init(...params)
    {

    },

    handleData(data)
    {
        for (let i = 0; i < this.watchPathArr.length; i++) {
            const watchPath = this.watchPathArr[i];
            var cData = unit.MVMgr.findData(data, watchPath);
            if (cData) {
                this._changeProgress(cData);
                break;
            }
        } 
    },

    _changeProgress(progress)
    {
        if (!cc.isValid(this.bindNode)) { return; }
        if (this.bindNode.getComponent(cc.ProgressBar)) { this.bindNode.getComponent(cc.ProgressBar).progress = progress; }
    },
});