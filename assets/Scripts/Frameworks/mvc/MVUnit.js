/*
 * @Author: jacklove
 * @Date: 2020-03-29 11:16:51
 * @LastEditTime: 2020-12-11 17:21:33
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\mvc\MVUnit.js
 */

let MVBase = require('./view/MVBase')
let MVDef = require('./MVDef')

cc.Class({
    extends: cc.Component,

    properties: {

        bind_mode : {
            default :MVDef.BindMode.auto,
            type : MVDef.BindMode,
            tooltip : '绑定模式',
            notify() {
                this.setBindType();
            },
        },

        bind_type : {
            default : -1,
            tooltip : '绑定类型',
            readonly : true,
            visible : false,
        },

        show_bind_type : {
            default : 'unknown',
            tooltip : '绑定类型',
            readonly : true,
            displayName : 'bind_type',
            visible() {
                return this.bind_mode == MVDef.BindMode.auto;
            },
        },

        s_uuid : {
            default : '',
            tooltip : 'uuid',
            displayName : 'uuid',
            readonly : true,
        },

        handle_cls : {
            default : null,
            type : MVBase,
            tooltip : '组件参数列表',
        },
    },

    editor : {
        executeInEditMode : true,
    },

    onLoad () {
        // cc.log('MVUnit onLoad', CC_EDITOR);
        if (CC_EDITOR) { 
            // cc.Class["Attr"].setClassAttr(this, 'bind_key', 'type', 'Enum');
            // cc.Class["Attr"].setClassAttr(this, 'bind_key', 'enumList', cc.Enum.getList(unit.MVDef.BindDef));
            this.setBindType();
            this.showUUID();
            if (this.handle_cls == null)  { this.setHandle(); } 
        }
        else
        {
            if (this.handle_cls != null) { this.handle_cls.init(this.node); }
        }

    },

    start () {
    },

    // update (dt) {},

    onEnable()
    {
        unit.MVMgr.bind(this.node);
    },

    onDisable()
    {
        unit.MVMgr.unbund(this.node);
    },

    setHandle()
    {
        let BT = MVDef.BindType;
        let BM = MVDef.BindMode;

        if (this.bind_mode == BM.auto) {
            if (this.bind_type == BT.MVLabel || this.bind_type == uBT.MVRichText) {
                let MVLabel = require('./view/MVLabel')
                this.handle_cls = new MVLabel();
            }
            else if (this.bind_type == BT.MVSprite) {
                let MVSprite = require('./view/MVSprite')
                this.handle_cls = new MVSprite();
            }
            else if (this.bind_type == BT.MVSkel) {
                let MVSkel = require('./view/MVSkel')
                this.handle_cls = new MVSkel();
            }
            else if (this.bind_type == BT.MVProgress) {
                let MVProgress = require('./view/MVProgress')
                this.handle_cls = new MVProgress();
            }
            else
            {
                let MVNode = require('./view/MVNode')
                this.handle_cls = new MVNode();
            }
        } else {
            let MVCustom = require('./view/MVCustom')
            this.handle_cls = new MVCustom();
        }
        this.handle_cls.initEditMode(this.node);
    },

    setBindType()
    {
        let BT = unit.MVDef.BindType;
        let BM = unit.MVDef.BindMode;

        if (this.bind_mode == BM.auto) {
            if (this.node.getComponent(cc.Label)) { this.bind_type = BT.MVLabel; }
            else if (this.node.getComponent(cc.RichText)) { this.bind_type = BT.MVRichText; }
            else if (this.node.getComponent(cc.ProgressBar)) { this.bind_type = BT.MVProgress; }
            else if (this.node.getComponent(cc.Sprite)) { this.bind_type = BT.MVSprite; }
            else if (this.node.getComponent(sp.Skeleton)) { this.bind_type = BT.MVSkel; }
            else { this.bind_type = BT.MVNode; }
        }
        else { this.bind_type = BT.MVCustom; }

        this.show_bind_type = BT[this.bind_type];
    },

    showUUID()
    {
        this.s_uuid = this.uuid;
    },

    getBindType()
    {
        return this.bind_type;
    },

    handleData(data)
    {
        if (this.handle_cls) { this.handle_cls.handleData(data); }
    },

    getWatchs()
    {
        if (this.handle_cls) { return this.handle_cls.watchPathArr; }
        return [];
    },

});
