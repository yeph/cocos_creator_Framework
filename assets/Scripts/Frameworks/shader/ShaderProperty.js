/*
 * @Author: jacklove
 * @Date: 2019-12-16 14:03:11
 * @LastEditTime: 2019-12-16 14:13:52
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewResProject\assets\Script\Frameworks\manager\shader\ShaderProperty.js
 */

let ShaderDef = require("ShaderDef")

cc.Class({
    name: 'ShaderProperty',

    properties: {
        property_type : {
            default: ShaderDef.PropertyDef.Time,
            type : cc.Enum(ShaderDef.PropertyDef), 
            tooltip : "着色器参数类型",
        },

        property_time_value : {
            default: true,
            // type : Boolean,
            displayName : 'value',
            tooltip : "参数值",
            visible() {
                return this.property_type == ShaderDef.PropertyDef.Time;
            },
        },
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
