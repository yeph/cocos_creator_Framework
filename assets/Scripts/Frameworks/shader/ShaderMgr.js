/*
 * @Author: jacklove
 * @Date: 2019-12-15 14:38:54
 * @LastEditTime: 2021-01-13 14:13:46
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\shader\ShaderMgr.js
 */

let ShaderDef = require("ShaderDef")

module.exports = {

    effectAssets : new Array(),

    isValid : false,

    init()
    {
        this._loadConfig();
    },

    __init__()
    {
        cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
            this._loadConfig();
        });
    },

    _loadConfig()
    {
        if (this.isValid) {
            return;
        }
        if (!cc.resources) {
            return;
        }

        this.isValid = true;
        cc.resources.loadDir('Effects', cc.EffectAsset, null, (error, res) => {
            // console.error(error, res);
            if (error) { return; }
            for (let index = 0; index < res.length; index++) {
                this.effectAssets[res[index]._name] = res[index];
            }
        });
    },

    _getEffectAsset(effect_enum)
    {
        var effect_name = ShaderDef.EffectDef[effect_enum];

        return this.effectAssets[effect_name];
    },

    _createMaterial(effectAsset)
    {
        //实例化一个材质对象
        let material = new cc.Material();

        // //为材质设置effect，也是就绑定Shader了
        material.effectAsset = effectAsset;
        material.name = effectAsset.name;

        material.define('USE_TEXTURE', true);
        
        return material;
    },

    setShader(target, effect_enum)
    {
        let sprite = target.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }

        let effectAsset = this._getEffectAsset(effect_enum);
        if (!effectAsset) {
            return;
        }

        //实例化一个材质对象
        let material = this._createMaterial(effectAsset);
        
        //将材质绑定到精灵组件上，精灵可以绑定多个材质
        //这里我们替换0号默认材质
        sprite.setMaterial(0, material);
    },
};

module.exports.__init__();