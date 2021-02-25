/*
 * @Author: jacklove
 * @Date: 2019-12-16 09:59:35
 * @LastEditTime: 2019-12-16 14:38:12
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewResProject\assets\Script\Frameworks\manager\shader\ShaderDef.js
 */

var ShaderDef = module.exports;

ShaderDef.PropertyDef = cc.Enum({
    Time : 0,
    Position : 1,
});

ShaderDef.EffectDef = cc.Enum({
    Normal : 0,
    Gray : 1,
    Ice : 2,
    Stone : 3,
    Frozen : 4,
    Brightness : 5,
    Fluxay : 6,
    Water : 7,
	Mosaic : 8,
    WaveLight : 9,
});