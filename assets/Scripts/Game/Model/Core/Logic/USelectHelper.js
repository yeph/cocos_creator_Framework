/*
 * @Author: your name
 * @Date: 2021-01-08 20:00:17
 * @LastEditTime: 2021-01-17 17:28:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Logic\USelectHelper.js
 */

module.exports = {

    selectTargetIds(caster_id, ability_id)
    {
        let caster = uGS.ActorMgr.getActor(caster_id);

        let caster_team = uGS.Logic.getAttriValue(caster_id, uGS.AttriType.team);
        let target_ids = [];
        

        let ab_cfg = uGS.AbilityMgr.getConfig(ability_id);// 获得技能信息

        if (ab_cfg.target == 'team') {
            target_ids = this.selectActor(true, caster_team, 1, -1);
            // console.error(target_ids);
        } else if (ab_cfg.target == 'enemy') {
            target_ids = this.selectActor(false, caster_team, 1, -1);
        }
        else if (ab_cfg.target == 'caster') {
            target_ids = [caster_id];
        }

        // remove dead
        let target_ids_noDead = [];
        for (let i = 0; i < target_ids.length; i++) {
            const act_id = target_ids[i];
            if (uGS.Logic.isDead(act_id) == false) {
                target_ids_noDead.push(act_id);
            }
        } 

        target_ids = target_ids_noDead;

        let amount = ab_cfg.target_amount;

        if (amount == -1) {
            return target_ids;
        }

        if (target_ids.length > amount) {
            let result = [];
            for (let i = 0; i < amount; i++) {
                let r = uGS.tool.r2I(0, target_ids.length - 1);
                result.push(target_ids[r]);
                target_ids.splice(r, 1);
            }
            return result;
        }

        return target_ids;
    },
    
    selectActor(sameTeam, team, radius = 1, num = 1)
    {
        let arr = [];
        let actors = uGS.ActorMgr.getActors();
        for (let i = 0; i < actors.length; i++) {
            const _actor = actors[i];

            // 判断阵营
            let j_team = uGS.Logic.getAttriValue(_actor.getId(), uGS.AttriType.team);
            if (sameTeam == true) {
                if (j_team != team) { continue; }
            }
            else
            {
                if (j_team == team) { continue; }
            }

            // 判断范围

            arr.push(_actor.getId());
            // 判断数量
            if (num == -1) { continue; }
            if (arr.length > num) {
                break;
            }
        }
        return arr;
    },
};