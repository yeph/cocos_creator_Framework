/*
 * @Author: jacklove
 * @Date: 2020-07-30 12:18:57
 * @LastEditTime: 2020-08-21 14:56:15
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\view\MVSprite.js
 */ 
let MVBase = require('./MVBase')

cc.Class({
    extends: MVBase,
    name : 'MVSprite',

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
                // console.error(cData)
                this._changeSprite(cData[0], cData[1], cData[2]);
                break;
            }
        } 
    },

    _changeSprite(atlasName, frameName, type)
    {
        if (type == 'url') {
            unit.ResMgr.webImage(atlasName, this.bindNode);
        } else {
            unit.ResMgr.replaceFrame(this.bindNode, atlasName, frameName);
        }
    },
});
