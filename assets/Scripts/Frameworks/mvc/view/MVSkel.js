/*
 * @Author: jacklove
 * @Date: 2020-07-30 12:19:19
 * @LastEditTime: 2020-07-31 14:26:17
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\view\MVSkel.js
 */ 
let MVBase = require('./MVBase')

cc.Class({
    extends: MVBase,
    name : 'MVSkel',

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

    handleData(data)
    {
        for (let i = 0; i < this.watchPathArr.length; i++) {
            const watchPath = this.watchPathArr[i];
            var cData = unit.MVMgr.findData(data, watchPath);
            if (cData) {
                this._changeSkel(cData[0], cData[1]);
                break;
            }
        } 
    },

    _changeSkel(url, play_data)
    {
        unit.ResMgr.replaceSkel(this.bindNode, url, (skelData)=>{
            if (skelData && play_data) {
                var comp =  this._getComp();
                if (comp != null) { comp.play(play_data); }
            }
            
        });
    },

    _getComp()
    {
        if (!cc.isValid(this.bindNode)) { return null; }

        var comp = this.bindNode.getComponent('SpineUnit');
        if (comp == null) { comp = this.bindNode.addComponent('SpineUnit'); }
        return comp;
    },
});
