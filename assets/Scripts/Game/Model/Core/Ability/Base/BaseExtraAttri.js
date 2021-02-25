/*
 * @Author: your name
 * @Date: 2021-01-15 17:36:20
 * @LastEditTime: 2021-01-17 17:13:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Ability\Base\BaseExtraAttri.js
 */

let AbilityBase = require('../AbilityBase');

class BaseExtraAttri extends AbilityBase {

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
            uGS.Logic.modifyAttri(target_id, ab_cfg.attri_name, value, caster_id);
        }

    };

    onEvent(msg)
    {
        console.error(msg);
        // let config = uGS.AbilityMgr.getConfig(this.getId());
        // if (Object.hasOwnProperty.call(config, 'trigger') == false) { return; }
        // for (let i = 0; i < config.trigger.length; i++) {
        //     const event_data = config.trigger[i];
        //     if (msg.type == event_data.event_name) {
        //         let targetIds = this.getAbilityTargets(caster_id, this.getId());
        //         this.execute(caster_id, targetIds);
        //     }            
        // }

    };
};
module.exports = BaseExtraAttri;