/*
 * @Author: your name
 * @Date: 2021-01-03 13:02:00
 * @LastEditTime: 2021-01-15 13:54:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\Trigger\TriggerDef.js
 */
module.exports = {

    // Trigger Type
    TriggerType : {
        //-------------------------- 基本定义 --------------------------//
        none : 'none',                           // 什么都没有
        action_begin : 'action_begin',                   // 行动开始
        action_end : 'action_end',                     // 行动结束
        check_skill : 'check_skill',                    // 检测可用技能
        use_skill : 'use_skill',                      // 使用技能
        play_skill : 'play_skill',                      // 播放技能动画
        cast_skill : 'cast_skill',                      // 结算技能

        modify_attri : 'modify_attri',              // 改变属性
        modify_mp : 'modify_mp',              // 改变mp
        modify_hp : 'modify_hp',              // 改变hp
        //-------------------------- 其他定义 --------------------------//
    },

};