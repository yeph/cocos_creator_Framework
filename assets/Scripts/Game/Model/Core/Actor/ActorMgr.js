/*
 * @Author: jacklove
 * @Date: 2020-12-14 16:06:48
 * @LastEditTime: 2021-01-17 17:26:36
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\ActorMgr.js
 */
module.exports = {

    m_actors : new Array(),

    createActor(actor_id)
    {
        let UActor = require('./UActor');
        let uActor = new UActor(actor_id);
        this.m_actors.push(uActor);
        return uActor;
    },

    createAttri(attri_name)
    {
        let UAttri = require('./UAttri');
        let uAttri = new UAttri(attri_name);
        return uAttri;
    },

    // 给人物赋值技能
    addAblitys(actor_id, ability_ids)
    {
        let actor = this.getActor(actor_id);
        if (actor == null) {
            uGS.tool.error('no actor id=[' + actor_id + ']');
            return null;
        }

        for (let i = 0; i < ability_ids.length; i++) {
            const ability_id = ability_ids[i];
            let ability = uGS.AbilityMgr.createAbility(ability_id);
            if (ability == null) {
                continue;
            }
            actor.pushAbility(ability);
        }
    },

    // 获得人物
    getActor(actor_id)
    {
        for (let i = 0; i < this.m_actors.length; i++) {
            const _actor = this.m_actors[i];
            if (_actor.getId() == actor_id) { return _actor; }
        }
        return null;
    },

    getActors()
    {
        return this.m_actors;
    },

    clearAll()
    {
        this.m_actors.length = 0;
    },

    // 获得人物属性值
    getAttri(actor_id, attri_name)
    {
        let actor = this.getActor(actor_id);
        if (actor == null) {
            uGS.tool.error('no actor id=[' + actor_id + ']');
            return null;
        }

        return actor.getAttri(attri_name, null);
    },

    setAttris(actor_id, attr_list)
    {
        let actor = this.getActor(actor_id);
        if (actor == null) {
            uGS.tool.error('no actor id=[' + actor_id + ']');
            return;
        }

        // for (const key in attr_list) {
        //     actor.setAttri(key, attr_list[key]);
        // }
        for (let i = 0; i < attr_list.length; i++) {
            const attri = attr_list[i];
            actor.setAttri(attri);
        }
    },

    modifyAttri(actor_id, attri_name, value)
    {
        let actor = this.getActor(actor_id);
        if (actor == null) {
            uGS.tool.error('no actor id=[' + actor_id + ']');
            return null;
        }

        let attr_value = actor.modifyAttri(attri_name, value);

        return attr_value;
    },

    selectActor(sameTeam, team, radius = 1, num = 1)
    {
        let arr = [];
        // for (let i = 0; i < this.m_actors.length; i++) {
        //     const _actor = this.m_actors[i];

        //     // 判断阵营
        //     if (sameTeam == true) {
        //         if (_actor.getAttri(uGS.AttriType.team) != team) { continue; }
        //     }
        //     else
        //     {
        //         if (_actor.getAttri(uGS.AttriType.team) == team) { continue; }
        //     }

        //     // 判断范围

        //     arr.push(_actor.getId());
        //     // 判断数量
        //     if (num == -1) { continue; }
        //     if (arr.length > num) {
        //         break;
        //     }
        // }
        return arr;
    },
};