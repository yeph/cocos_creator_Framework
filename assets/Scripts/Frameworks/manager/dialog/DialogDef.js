/*
 * @Description: 对话框定义
 * @Author: jacklove
 * @LastEditors: jacklove
 * @Date: 2019-04-18 16:27:03
 * @LastEditTime: 2020-12-11 17:43:48
 */


module.exports = {

    // Dialog Model
    DialogModel : cc.Enum({
        destory : 0,              // 毁灭模式
        hide : 1,                 // 神隐模式
    }),

    // Dialog State
    DialogState : cc.Enum({
        closed : 0,             // 关闭
        opened : 1,             // 开启
        opening : 2,            // 打开中
        closing : 3,            // 关闭中
    }),

    // Dialog Animation
    DialogAnimation : cc.Enum({
        // no_animation : 0,             // 没有动画
        // scale_to : 1,                 // 由小变大
        // ease_back_out : 2,            // 由小变大（回弹）
        // left_to_right : 3,            // 左到右
        // right_to_left : 4,            // 右到左
        // top_to_down : 5,              // 上到下
        // down_to_top : 6,              // 下到上
        // rotate_to_centre : 7,         // 旋转到中心
        // fade_to_centre : 8,           // 淡入
        // fall_to_centre : 9,           // 坠入
        // jump_to_centre : 10,          // 跳入
        // flip_to_centre : 11,          // 翻转

        no_animation : 0,

        scale_to_mid : 1,
        left_to_right : 2,
        right_to_left : 3,
        top_to_down : 4,
        down_to_top : 5,
        rotate_to_mid : 6,
        fade_to_mid : 7,
        fall_to_mid : 8,
        flip_to_mid : 9,

        // ease_
        ease_scale_to_mid : 1001,
        ease_left_to_right : 1002,
        ease_right_to_left : 1003,
        ease_top_to_down : 1004,
        ease_down_to_top : 1005,
        ease_rotate_to_mid : 1006,
        ease_fade_to_mid : 1007,
        ease_fall_to_mid : 1008,
        ease_flip_to_mid : 1009,
    }),

    MaskModel : cc.Enum({
        more : 0,       // 人手一个
        single : 1,     // 单一
    }),

    DialogEvent : '_dialog_event_',

    DialogID : cc.Enum({
        dlg_unknown : 0,
    }),
};