/*
 * @Author: your name
 * @Date: 2021-01-05 17:21:17
 * @LastEditTime: 2021-01-08 21:09:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Scene\Game\GameUI\UIUp.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        run_node : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initBattle();
    },

    update (dt) {
        this.updateRun(dt);
    },

    initBattle()
    {
        // unit.DataMgr.setCache('_create_actor_', 0);
        let list = uGS.Logic.getActorInfos();
        for (let i = 0; i < list.length; i++) {
            const actor_info = list[i];
            this.creatRun(actor_info);
        }
    },
    
    creatRun(actor_info)
    {
        unit.PoolMgr.getPerfab(uLg.PoolID[uLg.PoolID.p_mini_player], (prefab_node)=>{
            this.run_node.addChild(prefab_node);

            prefab_node.getComponent('MiniPlayer').setActorInfo(actor_info);
        });
    },

    updateRun(dt)
    {
        if (!uGS.BattleMgr.isGameRunning()) {
            return;
        }

        let list = unit.PoolMgr.getUsedPerfab(uLg.PoolID[uLg.PoolID.p_mini_player]);
        for (let i = 0; i < list.length; i++) {
            const prefab_node = list[i];
            prefab_node.getComponent('MiniPlayer').refreshInfo();
        }
    },
});
