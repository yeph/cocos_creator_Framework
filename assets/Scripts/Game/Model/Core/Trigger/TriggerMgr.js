/*
 * @Author: your name
 * @Date: 2021-01-02 13:37:43
 * @LastEditTime: 2021-01-08 21:07:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\TriggerMgr.js
 */
module.exports = {

    m_trigger : new Array(),

    // 系统默认监听
    listen(type, callback, cls, priority = 0)
    {
        uGS.EventMgr.listen_mgr(uGS.EventType.TRIGGER, type, callback, cls, priority);
    },
    
    // 系统默认分发消息
    dispatch(type, data)
    {
        uGS.EventMgr.dispatch_mgr(uGS.EventType.TRIGGER, type, data);
    },

    pushTrigger(trigger)
    {
        this.m_trigger.push(trigger);
    },

    createTrigger(actor_id, type, params = {})
    {
        let UTrigger = require('./UTrigger');
        let uTrigger = new UTrigger();
        uTrigger.setCasterId(actor_id);
        uTrigger.setType(type);
        uTrigger.setParams(params);
        
        this.pushTrigger(uTrigger);
        return uTrigger;
    },
    
    popTrigger()
    {
        if (this.m_trigger.length > 0) {
            return this.m_trigger.pop();
        }
        return null;
    },

    // 按顺序一条一条执行
    runTriggerOrder()
    {
        let trigger = this.popTrigger();
        if (trigger == null) {
            return false;
        }

        // action;
        uGS.tool.error(trigger.toLog());
        this.executeTrigger(trigger);
        return true;
    },

    // 全部执行
    runTriggerImmediate()
    {
        if (this.m_trigger.length <= 0) {
            return false;
        }

        for (let i = 0; i < this.m_trigger.length; i++) {
            const trigger = this.m_trigger[i];
            this.executeTrigger(trigger);
        }
        this.m_trigger.length = 0;
        return true;
    },

    executeTrigger(trigger)
    {
        // uGS.tool.error(trigger.toLog());
        this.dispatch(trigger.getType(), trigger.getMsg());
    },

    // doTrigger(trigger)
    // {
    //     let type = trigger.getType();
    //     let actor_id = trigger.getCasterId();

    //     let TT = uGS.TriggerType;

    //     if (type == TT.action_begin) {
    //         this.createTrigger(actor_id, TT.check_skill);
    //     }
    //     else if (type == TT.check_skill) {
    //         let caster = uGame.ActorMgr.getActor(actor_id);
    //         let ab_list = caster.getAbilityList();
    //         let ab_id = -1;
    //         // check skill cd
    //         for (let i = 0; i < ab_list.length; i++) {
    //             ab_id = ab_list[i].getId();
    //             break;
    //         }

    //         this.createTrigger(actor_id, TT.use_skill, { skill_id : ab_id, });
    //     }
    //     else if (type == TT.use_skill) {
    //         let ab_id = trigger.getParams().skill_id;
    //         uGame.GameLogic.cast_skill(actor_id, ab_id);
    //     }

    //     this.dispatch(trigger.getMsg());
    // },
};