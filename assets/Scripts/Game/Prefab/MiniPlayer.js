/*
 * @Author: your name
 * @Date: 2021-01-05 17:43:50
 * @LastEditTime: 2021-01-17 17:14:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Prefab\MiniPlayer.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        lbl_id : cc.Label,
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

    setActorInfo(actor_info)
    {
        this.actor_info = actor_info;
        this.m_id = uGS.Logic.getAttriValue(actor_info.actor.getId(), uGS.AttriType.id);
        this.lbl_id.string = this.m_id;
        this.refreshInfo();
    },

    refreshInfo()
    {
        // console.warn(this.m_id, this.actor_info.distance);
        this.node.x = this.actor_info.distance / 1000 * 600;
    },
});
