/*
 * @Author: your name
 * @Date: 2021-01-14 12:16:58
 * @LastEditTime: 2021-01-15 16:48:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Ability\Base\BaseDamage.js
 */

let AbilityBase = require('../AbilityBase');

class BaseDamage extends AbilityBase {

    constructor(id)
    {
        super(id);
    };

    execute(caster_id, target_ids)
    {
        // console.error('execute', caster_id, target_ids);

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
            let ak = uGS.Logic.getAttriValue(caster_id, uGS.AttriType.attack);
            let ar = uGS.Logic.getAttriValue(target_id, uGS.AttriType.armor);
            let damage = uGS.Formula.damage_function2(ak, ar);
            // let damage = uGS.UGameFormula.damage_formula(uGS.Logic.getAttriValue(caster_id, uGS.AttriType.attack), uGS.Logic.getAttriValue(target_id, uGS.AttriType.armor));
            uGS.Logic.modifyHP(target_id, -damage, caster_id);
        }

    };
};
module.exports = BaseDamage;