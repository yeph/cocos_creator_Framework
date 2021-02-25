/*
 * @Author: your name
 * @Date: 2021-01-07 21:05:22
 * @LastEditTime: 2021-01-17 17:24:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\AI\AIMgr.js
 */

module.exports = {
    
    __init__()
    {
        uGS.TriggerMgr.listen(uGS.TriggerType.action_begin, this.onTriggerEvent, this);
    },

    onTriggerEvent(msg)
    {
        let TT = uGS.TriggerType;
        // if (msg.type != TT.action_begin) {
        //     return;
        // }

        let caster_id = msg.caster_id;
        // 查找可用使用的技能
        let ab_id = this.getAbilityId(caster_id);
        if (ab_id == -1) {
            return;
        }
        // 选择技能目标
        let targetIds = this.getAbilityTargets(caster_id, ab_id);
        // 播放技能动画
        uGS.TriggerMgr.createTrigger(msg.caster_id, TT.play_skill, { ability_id : ab_id, targetIds : targetIds});
    },

    // 获得可使用的技能
    getAbilityId(caster_id)
    {
        let caster = uGS.ActorMgr.getActor(caster_id);
        let ab_list = caster.getAbilityList();
        let ab_id = -1;
        // check skill cd
        // check active
        for (let i = 0; i < ab_list.length; i++) {
            // 非主动技能
            if (ab_list[i].getType() != 0) { continue; }
            ab_id = ab_list[i].getId();
            break;
        }

        return ab_id;
    },

    // 获得技能目标
    getAbilityTargets(caster_id, ability_id)
    {
        let caster = uGS.ActorMgr.getActor(caster_id);

        let ability = caster.getAbility(ability_id);
        if (ability == null) {
            return;
        }

        let targetIds = uGS.USelectHelper.selectTargetIds(caster_id, ability_id);
        return targetIds;
    },

    // 技能动画结束，计算伤害
    execute_skill()
    {

    },
    
};
// module.exports.__init__();