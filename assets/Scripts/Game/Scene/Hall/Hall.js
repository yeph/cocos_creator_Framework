/*
 * @Author: jacklove
 * @Date: 2020-07-24 11:17:23
 * @LastEditTime: 2021-01-17 14:30:59
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Scene\Hall\Hall.js
 */ 

cc.Class({
    extends: cc.Component,

    properties: {
        img_head:
        {
            default: null,
            type : cc.Sprite,
            tooltip : '粒子节点',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        unit.MemoryDetector.showMemoryStatus();
        cc.debug.setDisplayStats(false);
        unit.DialogMgr.listen(this.onDialogEvent, this, 0);
    },

    onDialogEvent(data)
    {
        console.warn('onDialogEvent', data.data);
    },

    start () {
        unit.ResMgr._logger();
        this.hero_count = 0;
        this.monster_count = 0;
    },

    onDestroy()
    {
    },

    // update (dt) {},

    onClickLoad()
    {
        // unit.SceneMgr.loadingScene('IGame');
        uGS.BattleMgr.prepare({
            speed : 2,
            // seed : 0,
        });
        unit.SceneMgr.loadingScene('Game');
    },

    onClickHero()
    {
        if (this.hero_count >= 6) {
            return;
        }
        this.hero_count++;
        if (this.hero_count == 2) {
            uGS.UDebug.randHero(this.hero_count, [1]);
        } else {
            uGS.UDebug.randHero(this.hero_count, [3]);
        }
        // uGame.BattleMgr
    },

    onClickMonster()
    {
        if (this.monster_count >= 1) {
            return;
        }
        this.monster_count++;
        uGS.UDebug.randMonster(1000 + this.monster_count, [10000]);
        // uGame.BattleMgr
    },
});
