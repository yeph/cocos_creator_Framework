/*
 * @Author: jacklove
 * @Date: 2020-03-29 15:11:06
 * @LastEditTime: 2020-07-31 17:10:49
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\MVDef.js
 */
// 不要改变枚举数值，会影响到编辑器里已经绑定好的控件
module.exports = ({
    //----------------- 注册控件事件 -----------------//
    BindDef : cc.Enum({
        unknown : 0,
    }),

    // 绑定模式
    BindMode : cc.Enum({
        auto : 0,   // 自动绑定
        custom : 1,  // 自定义绑定
    }),

    // 绑定类型
    BindType : cc.Enum({
        MVNode : 0,
        MVLabel : 1,
        MVSprite : 2,
        MVSkel : 3,
        MVCustom : 4,
        MVProgress : 5,
        MVRichText :6,
    }),
    
});
// 不要改变枚举数值，会影响到编辑器里已经绑定好的控件