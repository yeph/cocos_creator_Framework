/*
 * @Author: your name
 * @Date: 2021-01-07 22:06:47
 * @LastEditTime: 2021-01-17 13:51:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Def\UGameDef.js
 */

module.exports = {

    GameState : {
        wait : 'wait',       // 等待
        start : 'start',      // 开始
        running : 'running',    // 运行
        finish : 'finish',     // 结束
        resume : 'resume',     // 恢复
        pause : 'pause',      // 暂停
    },

    ActorState : {
        alive : 'alive',
        dead : 'dead',
    },

    AttriType : {
        id : 'id',
        team : 'team',

        health : 'health',
        mana : 'mana',
        speed : 'speed',
        attack : 'attack',
        armor : 'armor',

        // attack_base : 'attack_base',
        // health_base : 'health_base',
        // armor_base : 'armor_base',
        // speed_base : 'speed_base',
        // mana_base : 'mana_base',

        // speed : 'speed',
        // attack : 'attack',
        // health : 'health',
        // armor : 'armor',
        // mana : 'mana',
    },

    // 来源类型
    OriginType : {
        base : 'base',
        ability : 'ability',
    },
};