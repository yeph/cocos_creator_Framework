/*
 * @Description: 对话框基类
 * @Author: jacklove
 * @LastEditors: jacklove
 * @Date: 2019-04-15 08:38:25
 * @LastEditTime: 2020-12-11 17:14:15
 */

 /**
 *                    _ooOoo_
 *                   o8888888o
 *                   88" . "88
 *                   (| -_- |)
 *                    O\ = /O
 *                ____/`---'\____
 *              .   ' \\| |// `.
 *               / \\||| : |||// \
 *             / _||||| -:- |||||- \
 *               | | \\\ - /// | |
 *             | \_| ''\---/'' | |
 *              \ .-\__ `-` ___/-. /
 *           ___`. .' /--.--\ `. . __
 *        ."" '< `.___\_<|>_/___.' >'"".
 *       | | : `- \`.;`\ _ /`;.`/ - ` : | |
 *         \ \ `-. \_ __\ /__ _/ .-` / /
 * ======`-.____`-.___\_____/___.-`____.-'======
 *                    `=---='
 *
 * .............................................
 *                 GOD BLESS YOU
 */

// let DialogMgr = require("DialogMgr")
let DialogDef = require('./DialogDef')
let DialogAction = require('./DialogAction')

cc.Class({
    extends: cc.Component,

    properties: {
        dialog_id : {
            default: -1,
            type : cc.Enum(DialogDef.DialogID),
            tooltip : '对话框资源路径',
            // visible : false,
            notify() {
                this._saveDialogInfo();
            },
        },

        isMask : {
            default: true,
            tooltip : '显示遮罩',
        },

        isInput : {
            default: true,
            tooltip : '不可穿透',
        },

        __maskId__ : {
            default: -1,
            type : cc.Integer, 
            tooltip : '遮罩对话框ID',
            visible : false,
        },

        single : {
            default: true,
            tooltip : '单一',
            notify() {
                this._saveDialogInfo();
            },
        },

        maskOpacity: {
            type: cc.Integer,
            default: 127,
            slide: true,
            min: 0,
            max: 255,
            step: 1,
            tooltip : '遮罩透明度',
            // serializable : false,
            visible() {
                return this.isMask == true;
                // return false;
            },
        },

        open_animation : {
            default: DialogDef.DialogAnimation.no_animation,
            type : cc.Enum(DialogDef.DialogAnimation), 
            tooltip : '对话框打开动画',
            notify() {
                if (this.same_animation == true) {
                    this._setSameAnimation();
                }
            },
        },

        close_animation : {
            default: DialogDef.DialogAnimation.no_animation,
            type : cc.Enum(DialogDef.DialogAnimation), 
            tooltip : '对话框关闭动画',
        },

        same_animation : {
            default: false,
            tooltip : '打开和关闭是否使用相同动画',
            notify() {
                this._setSameAnimation();
            },
        },

        open_ani_time : {
            default : 0.5,
            type : cc.Float, 
            tooltip : '打开动画播放时间',
        },
        close_ani_time : {
            default : 0.2,
            type : cc.Float, 
            tooltip : '打开动画播放时间',
        },

        test_debug : {
            default: false,
            tooltip : '测试功能',
        },

        random_animation : {
            default: false,
            tooltip : '随机动画',
            visible() {
                return this.test_debug == true;
            },
        },

        poolNum : {
            default: 1,
            type : cc.Integer, 
            tooltip : '初始化数量',
            visible : false,
        },

        __state__ : {
            default: DialogDef.DialogState.closed,
            type : cc.Enum(DialogDef.DialogState), 
            tooltip : '对话框状态(-1关闭,0打开中,1打开,2关闭中)',
            visible : false,
        },

        riginal_scale : {
            default: 1,
            type : cc.Float, 
            tooltip : '对话框原始尺寸',
            visible : false,
        },
        
        __disappear_model__ : {
            default: 0,
            serializable : false,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    editor : {
        executeInEditMode : true,
    },

    ctor()
    {
        if (CC_EDITOR) 
        {
            cc.Class["Attr"].setClassAttr(this, 'dialog_id', 'type', 'Enum');
            cc.Class["Attr"].setClassAttr(this, 'dialog_id', 'enumList', cc.Enum.getList(DialogDef.DialogID));
            // cc.log(this);
        }
    },

    onLoad () {
        this.riginal_scale = this.node.scale;
    },

    onDestroy()
    {
        // console.error('DialogBase onDestroy', DialogDef.DialogID[this.dialog_id]);
        if (CC_EDITOR) { return; }
        unit.DialogMgr._removeDialog(this.node);
    },

    onEnable()
    {
        // console.log('DialogBase onEnable');
    },

    onDisable()
    {
        // console.log('DialogBase onDisable');
    },

    // start () {},

    // update (dt) {},

    onEnter(params)
    {// 对话框被激活时
        console.log('DialogBase onEnter');
    },

    onLeave()
    {// 对话框被关闭时
        console.log('DialogBase onLeave');
    },

    onDead()
    {// 对话框被销毁

    },

    _getDialogId()
    {
        return this.dialog_id;
    },

    _saveDialogInfo()
    {
        let dlg_info = {
            dlg_id : this.dialog_id,
            single : this.single,
        };

        unit.DialogMgr.saveInfo(this.dialog_id, this.node.name, dlg_info);
    },

    setMask(mask)
    {
        unit.DialogMgr.setMaskMask(this.__maskId__, mask);
    },

    setIsInput(input)
    {
        unit.DialogMgr.setMaskInput(this.__maskId__, input);
    },

    _setMaskId(maskId)
    {
        this.__maskId__ = maskId;
    },

    _getMaskId()
    {
        return this.__maskId__;
    },

    _getIsMask()
    {
        return this.isMask;
    },

    _getMaskOpacity()
    {
        return this.maskOpacity;
    },

    _getIsInput()
    {
        return this.isInput;
    },

    _setState(state)
    {
        this.__state__ = state;
        this.stateEvent(this.__state__);
        unit.DialogMgr.dispatch(this.dialog_id, {state : this.__state__, });
    },

    _getState()
    {
        return this.__state__;
    },

    isSingle()
    {
        return this.single;
    },

    stateEvent(eventid)
    {

    },

    setDialogZIndex(zIndex)
    {
        unit.DialogMgr.setDialogZIndex(this.node, zIndex);
    },

    _setSameAnimation()
    {
        this.close_animation = this.open_animation;
    },

    closeDialog()
    {
        // 两种关闭方式
        unit.DialogMgr.closeDialog(this.node);
        /* 
            DialogMgr.closeDialog(this.dialog_id);
        */
    },

    _closeByMgr()
    {
        this._setState(DialogDef.DialogState.closed);
        unit.DialogMgr._closeDialog(this.node);
    },

    _getRandom(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    _playOpenAni()
    {
        var open_ani = this.open_animation;

        if (this.random_animation == true) {
            var index = this._getRandom(0, DialogDef.DialogAnimation.__enums__.length - 1);
            open_ani = DialogDef.DialogAnimation.__enums__[index].value;
            // console.log(open_ani);
        }

        this._setState(DialogDef.DialogState.opening);
        let action = DialogAction.createAni('open', open_ani, this.open_ani_time, this.riginal_scale, ()=>{
            this._setState(DialogDef.DialogState.opened);
        });

        this.node.opacity = 255;

        this.node.stopAllActions();
        if (action) {
            this.node.runAction(action);
        }
        else
        {
            this._setState(DialogDef.DialogState.opened);
        }

    },

    /**
     * @description: A Million Ways to Die in the West
     * @param {null} 
     * @return: null
     */
    _playCloseAni()
    {
        var close_ani = this.close_animation;

        if (this.random_animation == true) {
            var index = this._getRandom(0, DialogDef.DialogAnimation.__enums__.length - 1);
            close_ani = DialogDef.DialogAnimation.__enums__[index].value;
        }

        // console.error(close_ani);
        this._setState(DialogDef.DialogState.closing);
        let action = DialogAction.createAni('close', close_ani, this.close_ani_time, this.riginal_scale, ()=>{
            // this._setState(DialogDef.DialogState.closed);
            this._closeByMgr();
        });

        // console.error(action);
        this.node.stopAllActions();
        if (action) {
            this.node.runAction(action);
        }
        else
        {
            // this._setState(DialogDef.DialogState.closed);
            this._closeByMgr();
        }

    },

});
