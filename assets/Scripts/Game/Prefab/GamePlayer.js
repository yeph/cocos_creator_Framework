/*
 * @Author: your name
 * @Date: 2021-01-05 16:03:02
 * @LastEditTime: 2021-01-17 17:12:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Prefab\GamePlayer.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        lbl_id:
        {
            default: null,
            type : cc.Label,
            tooltip : 'id',
        },
        lbl_hp:
        {
            default: null,
            type : cc.Label,
            tooltip : '血量',
        },
        ani_node : cc.Node,
        img_player : cc.Node,
        m_id : cc.Integer,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    getId()
    {
        return this.m_id;
    },

    setActorInfo(actor)
    {
        this.m_actor = actor;
        this.m_id = uGS.Logic.getAttriValue(actor.getId(), uGS.AttriType.id);
        this.initByInfo();
    },

    initByInfo()
    {
        this.lbl_id.string = this.m_id;

        let info = uGS.Logic.getActorInfo(this.m_id);

        if (info) {
            this.lbl_hp.string = info[uGS.AttriType.health];
            this.m_hp = info[uGS.AttriType.health];
        }
        // this.lbl_hp.string = this.m_actor.getAttribute(uGS.AttriType.health);
        // this.m_hp = this.m_actor.getAttribute(uGS.AttriType.health);
    },

    refreshInfo(msg)
    {
        let info = uGS.Logic.getActorInfo(this.m_id);
        if (info == null) {
            return;
        }
        let hp = info[uGS.AttriType.health];
        this.lbl_hp.string = hp;

        if (this.m_hp > hp) {
            this.playHurted();
        }
        else if (this.m_hp < hp) {
            this.playAddBlood();
        }
        this.m_hp = hp;
    },

    playSkillAni(msg)
    {
        this.ani_node.stopAllActions();
        unit.Transition.create(this.ani_node)
            .place(0, 0)
            .moveBy(0.15, 0, 20)
            .moveBy(0.15, 0, -20)
            .callFunction((target) => {
                // uGS.Logic.execute_skill(msg.caster_id, msg.ability_id, msg.targetIds);
                uGS.Logic.cast_skill(msg.caster_id, msg.params.ability_id, msg.params.targetIds);
            })
            .runAction();
    },
    
    playHurted()
    {
        // console.error('playHurted');
        this.ani_node.stopAllActions();
        unit.Transition.create(this.ani_node)
            .place(0, 0)
            .callFunction((target) => {
                this.img_player.color = cc.color(200, 0, 0);
            })
            .delay(0.3)
            .callFunction((target) => {
                this.img_player.color = cc.color(255, 255, 255);
            })
            .runAction();
    },

    playAddBlood()
    {
        this.ani_node.stopAllActions();
        unit.Transition.create(this.ani_node)
            .place(0, 0)
            .callFunction((target) => {
                this.img_player.color = cc.color(0, 200, 0);
            })
            .delay(0.3)
            .callFunction((target) => {
                this.img_player.color = cc.color(255, 255, 255);
            })
            .runAction();
    },
});
