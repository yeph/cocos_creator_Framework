/*
 * @Author: your name
 * @Date: 2021-01-05 15:40:16
 * @LastEditTime: 2021-01-17 17:11:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Scene\Game\PlayerLayer.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        hero_layer:
        {
            default: null,
            type : cc.Node,
            tooltip : '进度',
        },
        monster_layer:
        {
            default: null,
            type : cc.Node,
            tooltip : '进度',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // uGS.EventMgr.listen(uGame.GameEventDef.MODIFY_ATTRIBUTE, this.onModifyAttribute, this);
        // uGS.EventMgr.listen(uGame.GameEventDef.USE_SKILL, this.onUseSkill, this);
        uGS.TriggerMgr.listen(uGS.TriggerType.play_skill, this.onUseSkill, this);
        uGS.TriggerMgr.listen(uGS.TriggerType.modify_attri, this.onModifyAttribute, this);
    },

    start () {
        this.initBattle();
    },

    // update (dt) {},

    initBattle()
    {
        unit.DataMgr.setCache('_create_actor_', 0);
        let list = uGS.ActorMgr.getActors();
        for (let i = 0; i < list.length; i++) {
            const actor = list[i];
            this.creatActor(actor);
        }
    },

    creatActor(actor)
    {
        unit.PoolMgr.getPerfab(uLg.PoolID[uLg.PoolID.p_game_player], (prefab_node)=>{
            // uGS.Logic.getAttriValue(actor.getId(), uGS.AttriType.team)
            if (uGS.Logic.getAttriValue(actor.getId(), uGS.AttriType.team) == 1) {
                this.hero_layer.addChild(prefab_node);
            }
            else
            {
                this.monster_layer.addChild(prefab_node);
            }

            prefab_node.getComponent('GamePlayer').setActorInfo(actor);

            let _create_actor_ = unit.DataMgr.getCache('_create_actor_', 0);
            _create_actor_++;
            unit.DataMgr.setCache('_create_actor_', _create_actor_);

            this.isLoadEnd();
        });
    },

    isLoadEnd()
    {
        let _create_actor_ = unit.DataMgr.getCache('_create_actor_', 0);
        let list = uGS.ActorMgr.getActors();
        if (_create_actor_ >= list.length) {
            uGS.BattleMgr.gameStart();
        }
    },

    _getActorView(actor_id)
    {
        let list = unit.PoolMgr.getUsedPerfab(uLg.PoolID[uLg.PoolID.p_game_player]);
        for (let i = 0; i < list.length; i++) {
            const prefab_node = list[i];
            if (prefab_node.getComponent('GamePlayer').getId() == actor_id) {
                return prefab_node;
            }
        }
        return null;
    },

    onModifyAttribute(msg)
    {
        let actor_id = msg.actor_id;
        let actor_view = this._getActorView(actor_id);
        if (actor_view) {
            actor_view.getComponent('GamePlayer').refreshInfo(msg);
        }
    },
    
    onUseSkill(msg)
    {
        let actor_id = msg.caster_id;
        let actor_view = this._getActorView(actor_id);
        if (actor_view) {
            actor_view.getComponent('GamePlayer').playSkillAni(msg);
        }
    },
});
