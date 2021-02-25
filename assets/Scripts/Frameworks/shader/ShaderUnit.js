/*
 * @Author: jacklove
 * @Date: 2019-12-15 14:38:00
 * @LastEditTime: 2021-01-14 13:30:25
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\shader\ShaderUnit.js
 */

let ShaderMgr = require("ShaderMgr")
let ShaderDef = require("ShaderDef")
let ShaderProperty = require("ShaderProperty")

cc.Class({
    extends: cc.Component,

    properties: {
        shader_type : {
            default: ShaderDef.EffectDef.Normal,
            type : cc.Enum(ShaderDef.EffectDef), 
            tooltip : "着色器类型",
            notify() {
                this.alertShader();
            },
        },

        shader_properties : {
            default : [],
            type : [ShaderProperty],
        },

        test_debug : {
            default: false,
            tooltip : "测试功能",
        },

        explain_label: {
            default: null,
            type: cc.Label,
            visible() {
                return this.test_debug == true;
            },
        },

        touch_change: {
            default: false,
            tooltip : "点击切换着色器",
            visible() {
                return this.test_debug == true;
            },
            // serializable : false,
        },

        _start : 0,
        _max : 65535,
    },

    editor : {
        executeInEditMode : true,
    },

    onLoad () {
        
        if (CC_EDITOR) 
        {
            this.alertShader();
        }
    },

    start () {
        this.alertShader();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onAlert, this);
    },

    update (dt) {
        this.updateEffect(dt);
    },

    setEffect(shader_type)
    {
        this.shader_type = shader_type;
        this.alertShader();
    },

    alertShader()
    {
        var shader_type = this.shader_type;
        ShaderMgr.setShader(this.node.getComponent(cc.Sprite) , shader_type);
        if (cc.isValid(this.explain_label)) {
            this.explain_label.string = ShaderDef.EffectDef[this.shader_type];
        }
    },

    updateEffect(dt)
    {
        var material = this.node.getComponent(cc.Sprite).getMaterial(0);
        if (!cc.isValid(material)) {
            return;
        }

        if (!material.getProperty('time')) {
            return;
        }

        // if (material.effect._properties['time'] == undefined) {
        //     return;
        // }

        let start = this._start;
        if (start > this.max) start = 0;
        start += dt;

        material.setProperty('time', start);

        this._start = start;
    },

    onAlert()
    {
        // console.error('onAlert', this.touch_change);
        if (!this.touch_change) {
            return;
        }
        this.shader_type = (this.shader_type + 1) % ShaderDef.EffectDef.__enums__.length;
        this.alertShader();
    },
    
});
