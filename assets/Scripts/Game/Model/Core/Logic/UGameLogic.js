/*
 * @Author: your name
 * @Date: 2021-01-08 13:54:22
 * @LastEditTime: 2021-01-17 17:15:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Logic\UGameLogic.js
 */

module.exports = {

    m_actorInfos : new Array(),

    __init__()
    {
        uGS.TriggerMgr.listen(uGS.TriggerType.modify_attri, this.onTriggerEvent, this);
    },

    log()
    {
        let log_res = [];
        for (let i = 0; i < this.m_actorInfos.length; i++) {
            const info = this.m_actorInfos[i];
            let _actor = info.actor;
            
            let sData = {
                id : _actor.getId(),
                speed : this.getAttriValue(_actor.getId(), uGS.AttriType.speed),
                dis : info.distance,
                hp : info[uGS.AttriType.health],
                mp : info[uGS.AttriType.mana],
                atk : this.getAttriValue(_actor.getId(), uGS.AttriType.attack),
            };

            log_res.push(sData);
        }
        console.warn(log_res);
    },

    tick(dt)
    {
        for (let i = 0; i < this.m_actorInfos.length; i++) {
            const info = this.m_actorInfos[i];
            let _actor = info.actor;
            if (info.state == uGS.ActorState.dead) { continue; }

            let speed = this.getAttriValue(_actor.getId(), uGS.AttriType.speed);
            info.distance += (speed * dt);

            if (info.distance < 1000) { continue; }
            info.distance = 0;

            uGS.TriggerMgr.createTrigger(_actor.getId(), uGS.TriggerType.action_begin);
        }
    },

    checkEnd()
    {
        let check_data = {};
        for (let i = 0; i < this.m_actorInfos.length; i++) {
            const info = this.m_actorInfos[i];
            let _actor = info.actor;
            let _team = uGS.Logic.getAttriValue(_actor.getId(), uGS.AttriType.team);
            if (!check_data['team_' + _team]) {
                check_data['team_' + _team] = 0;
            }

            if (info.state == uGS.ActorState.dead) { continue; }

            let health = info[uGS.AttriType.health];
            if (health > 0) {
                check_data['team_' + _team] += health;
            }
            
        }

        let team_count = 0;
        for (const key in check_data) {
            if (Object.hasOwnProperty.call(check_data, key)) {
                const total_health = check_data[key];
                if (total_health <= 0) {
                    return true;
                }
                team_count++;
            }
        }

        if (team_count <= 1) {
            return true;
        }

        return false;
    },

    clearAll()
    {
        this.m_actorInfos.length = 0;
    },

    getActorInfos()
    {
        return this.m_actorInfos;
    },

    getActorInfo(actor_id)
    {
        for (let i = 0; i < this.m_actorInfos.length; i++) {
            const info = this.m_actorInfos[i];
            let _actor = info.actor;
            if (actor_id == _actor.getId()) {
                return info;
            }
        }
        return null;
    },
    
    join(actor)
    {
        let AT = uGS.AttriType;
        
        let info = {
            actor : actor,
            distance : 0,
            state : uGS.ActorState.alive,
        }

        info[AT.health] = this.getAttriValue(actor.getId(), AT.health);
        info[AT.mana] = this.getAttriValue(actor.getId(), AT.mana);

        this.m_actorInfos.push(info);
    },

    dead(actor)
    {
        for (let i = 0; i < this.m_actorInfos.length; i++) {
            const info = this.m_actorInfos[i];
            let _actor = info.actor;
            if (actor == _actor) {
                info.state = uGS.ActorState.dead;
                break;
            }
        }
    },
    
    isDead(actor_id)
    {
        for (let i = 0; i < this.m_actorInfos.length; i++) {
            const info = this.m_actorInfos[i];
            let _actor = info.actor;
            if (actor_id == _actor.getId()) {
                return info.state == uGS.ActorState.dead;
            }
        }
        return true;
    },

    cast_skill(caster_id, ability_id, target_ids)
    {
        let caster = uGS.ActorMgr.getActor(caster_id);
        if (caster == null) {
            uGS.tool.error('caster is not exist id=[' + caster_id + ']');
            return;
        }
        let ability = caster.getAbility(ability_id);
        if (ability == null) {
            uGS.tool.error('ability is not exist id=[' + ability_id + ']');
            return;
        }

        ability.execute(caster_id, target_ids);
    },

    onTriggerEvent(msg)
    {
        console.error(msg);

        let info = this.getActorInfo(msg.actor_id);
        if (info == null) {
            return;
        }
        let hp = info[uGS.AttriType.health];

        if (msg.attri_name == uGS.AttriType.health && msg.value < 0) {
            let actor = uGS.ActorMgr.getActor(msg.actor_id);
            if (actor && hp <= 0) {
                this.dead(actor);
            }
        }
    },

    setAttri(actor_id, attri_name, value, origin, data = {})
    {
        let actor = uGS.ActorMgr.getActor(actor_id);
        let attri = uGS.ActorMgr.createAttri(attri_name);
        attri.setValue(value);
        attri.setOrigin(origin);
        for (const key in data) {
            attri.setData(key, data[key]);
        }

        actor.setAttri(attri);

    },

    // 获得属性列表
    getAttri(actor_id, attri_name)
    {
        let actor = uGS.ActorMgr.getActor(actor_id);
        let list = actor.getAttriList(attri_name);
        return list;
    },

    // 获得属性值
    getAttriValue(actor_id, attri_name)
    {
        let value = 0;
        let list = this.getAttri(actor_id, attri_name);
        for (let i = 0; i < list.length; i++) {
            const attri = list[i];
            value += attri.getValue();
        }
        return value;
    },

    addAttri(actor_id, attri)
    {
        let actor = uGS.ActorMgr.getActor(actor_id);
        actor.setAttri(attri);
    },

    modifyMP(actor_id, value, trigger_id)
    {
        return this.modifyAttri(actor_id, uGS.AttriType.mana, value, trigger_id);
    },

    modifyHP(actor_id, value, trigger_id)
    {
        return this.modifyAttri(actor_id, uGS.AttriType.health, value, trigger_id);
    },

    modifyAttri(actor_id, attri_name, value, trigger_id)
    {
        let info = this.getActorInfo(actor_id);
        if (info == null) {
            return false;
        }

        if (!Object.hasOwnProperty.call(info, attri_name)) {
            return false;
        }

        info[attri_name] += value;

        let max = this.getAttriValue(actor_id, attri_name);
        if (info[attri_name] > max) {
            info[attri_name] = max;
        }

        uGS.TriggerMgr.dispatch(uGS.TriggerType.modify_attri, {
            actor_id : actor_id, attri_name : attri_name, value : value, trigger_id : trigger_id,
        });
        return true;
    },
    
};