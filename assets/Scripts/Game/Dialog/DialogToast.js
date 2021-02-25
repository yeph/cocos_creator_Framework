/*
 * @Author: jacklove
 * @Date: 2020-08-26 16:51:02
 * @LastEditTime: 2021-01-14 12:55:59
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \client\assets\Script\Dialogs\System\DialogToast.js
 */
let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {
        base_node : cc.Node,
        show_lbl : cc.Label,
        toast_height : 50,
    },

    onLoad () {
        this.m_act_type = 'down';
        console.error('DialogToast onLoad');
    },

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        // console.error('DialogToast onEnter', params);

        if (params.hasOwnProperty('msg')) {
            this.show_lbl.string = params.msg;
        }

        let delay = 3;
        if (params.hasOwnProperty('delay')) {
            delay = params.delay;
        }

        this.m_act_type = 'down';
        if (params.hasOwnProperty('type')) {
            this.m_act_type = params.type;
        }

        // console.error('DialogToast', this.m_act_type);
        this.m_gap = 0;
        if (params.hasOwnProperty('gap')) {
            this.m_gap = params.gap;
        }
        
        this.scheduleOnce(this.closeDialog.bind(this), delay);
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    stateEvent(eventid)
    {

    },

    // update (dt) {},

    _playOpenAni()
    {
        this.base_node.opacity = 255;
        this.base_node.stopAllActions();
        switch (this.m_act_type) {
            case 'down':
                var action = cc.sequence(cc.place(cc.v2(0, -cc.winSize.height / 2 - this.toast_height * 1.0)), 
                        cc.moveTo(0.5, cc.v2(0, -cc.winSize.height / 2 + this.toast_height * .5)).easing(cc.easeBackOut()), 
                    );
                this.base_node.runAction(action);                
                break;
            case 'up':
                var action = cc.sequence(cc.place(cc.v2(0, cc.winSize.height / 2 + this.toast_height * 1.0)), 
                    cc.moveTo(0.5, cc.v2(0, cc.winSize.height / 2 - this.toast_height * .5)).easing(cc.easeBackOut()), 
                );
                this.base_node.runAction(action);                
                break;
            case 'center':
                this.base_node.setPosition(cc.v2(0, 0 + this.m_gap));  
                break;
            default:
                this.base_node.setPosition(cc.v2(0, 0)); 
                break;
        }

    },

    _playCloseAni()
    {
        this.base_node.opacity = 255;
        this.base_node.stopAllActions();
        switch (this.m_act_type) {
            case 'down':
                var action = cc.sequence( 
                    cc.moveTo(0.5, cc.v2(0, -cc.winSize.height / 2 - this.toast_height * 1.0)).easing(cc.easeBackIn()), 
                    cc.callFunc((target) => {
                        this._closeByMgr();
                    })
                );
                this.base_node.runAction(action);            
                break;
            case 'up':
                var action = cc.sequence( 
                    cc.moveTo(0.5, cc.v2(0, cc.winSize.height / 2 + this.toast_height * 1.0)).easing(cc.easeBackIn()), 
                    cc.callFunc((target) => {
                        this._closeByMgr();
                    })
                );
                this.base_node.runAction(action);                
                break;  
            case 'center':
                var action = cc.sequence(
                    cc.spawn(
                        cc.moveBy(0.5, cc.v2(0, this.toast_height)),
                        cc.fadeOut(0.5),  
                    ),                    
                    cc.callFunc((target) => {
                        this._closeByMgr();
                    })
                );
                this.base_node.runAction(action);                
                break;        
            default:
                this._closeByMgr();
                break;
        }

    },
    
});