/*
 * @Author: your name
 * @Date: 2021-01-14 13:05:16
 * @LastEditTime: 2021-01-15 17:31:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Ability\Base\BaseHealth.js
 */

let AbilityBase = require('../AbilityBase');

class BaseHealth extends AbilityBase {

    constructor(id)
    {
        super(id);
    };

    execute(caster_id, target_ids)
    {
        // console.error('execute', caster_id, target_ids);
        let ab_cfg = uGS.AbilityMgr.getConfig(this.getId());

        let caster = uGS.ActorMgr.getActor(caster_id);
        if (caster == null) {
            uGS.tool.error('caster is not exist id=[' + caster_id + ']');
            return;
        }
        for (let i = 0; i < target_ids.length; i++) {
            const target_id = target_ids[i];
            const target = uGS.ActorMgr.getActor(target_id);
            if (target == null) {
                uGS.tool.error('target is not exist id=[' + target_id + ']');
                continue;
            }
            let value = uGS.Formula.random_value(...ab_cfg.params);
            console.error(value);
            uGS.Logic.modifyHP(target_id, value, caster_id);
        }

    };
};
module.exports = BaseHealth;