/*
 * @Author: jacklove
 * @Date: 2020-07-31 17:12:33
 * @LastEditTime: 2020-07-31 17:23:38
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\view\MVNode.js
 */ 

let MVBase = require('./MVBase')

cc.Class({
    extends: MVBase,
    name : 'MVNode',

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
                this._changeSprite(cData[0], cData[1]);
                break;
            }
        } 
    },

    _changeSprite(atlasName, frameName)
    {
        // unit.ResMgr.replaceFrame(this.bindNode, atlasName, frameName, ()=>{});
        // cc.RichText;
    },
});

