/*
 * @Author: your name
 * @Date: 2021-01-07 21:34:50
 * @LastEditTime: 2021-01-08 20:34:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Action\ActionMgr.js
 */

module.exports = {
    
    doAction(caster_id, target_id, actions)
    {
        let value_map = {};

        for (let i = 0; i < actions.length; i++) {
            const action_str = actions[i];
            
            let list = action_str.split(/[=]/g);
            // console.error(list)
            if (list.length > 1) {

                let func_str = list[1];
                
                let func_list = func_str.split(/[(.*)]/g);
                let func_name = uGS.tool.trim(func_list[0]);
                // console.error(func_list);

                let params_list = func_list[1].split(/[/,]/g);
                let parmas = this.getParams(caster_id, target_id, params_list, value_map);
                // console.error(func_name, parmas);
                value_map[uGS.tool.trim(list[0])] = uGS.UGameFormula.result_formula(func_name, parmas);
            }
            else
            {
                let func_str = list[0];
                
                let func_list = func_str.split(/[(.*)]/g);
                let func_name = uGS.tool.trim(func_list[0]);
                // console.error(func_list);
                let params_list = func_list[1].split(/[/,]/g);
                let parmas = this.getParams(caster_id, target_id, params_list, value_map);
                // console.error(func_name, parmas);
                uGS.UGameFormula.result_formula(func_name, parmas);
            }            
        }
        
        value_map = null;
    },

    getParams(caster_id, target_id, params_list, value_map)
    {
        let caster = uGS.ActorMgr.getActor(caster_id);
        let target = uGS.ActorMgr.getActor(target_id);

        let result = [];
        for (let i = 0; i < params_list.length; i++) {
            const params_str = uGS.tool.trim(params_list[i]);
            
            if (params_str.indexOf('@') != -1) {
                let _list = params_str.split(/[@]/g);
                if (_list.length > 1) {

                    let is_symbol = uGS.tool.trim(_list[0]).indexOf('-') != -1;

                    let _list2 = _list[1].split(/[_]/g);
                    if (_list2[0].indexOf('caster') != -1) {
                        let attri = caster.getAttribute(uGS.tool.trim(_list2[1]));
                        if (is_symbol == false) {
                            result.push(attri);
                        }
                        else
                        {
                            result.push(-attri);
                        }
                    }
                    else if (_list2[0].indexOf('target') != -1) {
                        let attri = target.getAttribute(uGS.tool.trim(_list2[1]));
                        if (is_symbol == false) {
                            result.push(attri);
                        }
                        else
                        {
                            result.push(-attri);
                        }
                    }
                    else
                    {
                        let value = value_map[uGS.tool.trim(_list2[0])];
                        if (is_symbol == false) {
                            result.push(value);
                        }
                        else
                        {
                            result.push(-value);
                        }                         
                    }
                
                }
            }

            if (params_str.indexOf('#') != -1) {
                let _list3 = params_str.split(/[#]/g);
                let _list4 = _list3[1].split(/[/'.*/']/g);
                if (_list4.length > 1) {
                    result.push(_list4[1]);
                }
                else
                {
                    result.push(Number(_list3[1]));
                }
            }
        }

        return result;
    },
};