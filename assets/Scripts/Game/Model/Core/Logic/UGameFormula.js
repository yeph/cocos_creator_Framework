/*
 * @Author: your name
 * @Date: 2021-01-02 13:33:32
 * @LastEditTime: 2021-01-15 14:49:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\UGameFormula.js
 */

module.exports = {

    get_formula(formula_name)
    {
        if (this.hasOwnProperty(formula_name)) {
                return this[formula_name];
        }
        return null;
    },

    getCmdType(cmd_str)
    {
        if (cmd_str.indexOf('&&') != -1) {
            return 'and';
        }

        if (cmd_str.indexOf('||') != -1) {
            return 'or';
        }

        return 'none';
    },

    getCmdFunc(cmd_str)
    {
        let res = [];
        // let list = cmd_str.split(/[//&//&|//|//|]/g);
        // // console.warn(list);
        // for (let i = 0; i < list.length; i++) {
        //     const func_str = list[i];
        //     let func_name = func_str.split(/[(.*)]/g);
        //     // console.warn(func_name)
        //     if (func_name.length < 2) {
        //         continue;
        //     }
        //     let func = [];
        //     func.push(uGame.GameTool.trim(func_name[0]));
            
        //     let params = func_name[1].split(/[/,]/g);
        //     for (let j = 0; j < params.length; j++) {
        //         const element = params[j];
        //         func.push(uGame.GameTool.trim(element));
        //     }

        //     res.push(func);
        // }
        return res;
    },
    
    result_formula(formula_name, params)
    {
        let formula_func = this.get_formula(formula_name);
        if (formula_func == null) {
            uGS.tool.error('no function', formula_name);
            return null;
        }

        let result = formula_func(...params);
        return result;
    },

    damage_func(damage, armor)
    {
        return uGS.Formula.damage_function2(damage, armor);
    },

    attribute_func(actor_id, attribute_key, value, trigger_id)
    {
        let attr_value = uGS.ActorMgr.modifyAttr(actor_id, attribute_key, value);
        // uGS.UEventMgr.dispatch(uGame.GameEventDef.MODIFY_ATTRIBUTE, {
        //     actor_id : actor_id, attribute_key : attribute_key, value : value, trigger_id : trigger_id,
        // });
        console.error({actor_id : actor_id, attribute_key : attribute_key, value : value, trigger_id : trigger_id});
        return attr_value;
    },

    damage_formula(damage, armor)
    {
        return uGS.Formula.damage_function2(damage, armor);
    },

    attribute_formula(actor_id, attribute_key, value, trigger_id)
    {
        let attr_value = uGS.ActorMgr.modifyAttr(actor_id, attribute_key, value);
        uGS.TriggerMgr.dispatch(uGS.TriggerType.modify_attri, {
            actor_id : actor_id, attribute_key : attribute_key, value : value, trigger_id : trigger_id,
        });
        return attr_value;
    },
};