/*
 * @Author: jacklove
 * @Date: 2020-07-24 13:40:08
 * @LastEditTime: 2021-01-17 15:30:07
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Scene\Game\Game.js
 */ 
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        unit.MemoryDetector.showMemoryStatus();
        cc.debug.setDisplayStats(false);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        uGS.EventMgr.listen(this.onGameEvent, this);
    },

    start () {
        this.initBattle();
    },

    onDestroy()
    {
        // upGame.IRoomMgr.save();
        uGS.BattleMgr.clearAll();
    },

    update (dt) {
        uGS.BattleMgr.tick(dt);
    },

    onClickTo()
    {
        // unit.SceneMgr.loadingScene('Hall');
        unit.SceneMgr.loadingScene('Login');
    },

    initBattle()
    {
        // uGame.BattleMgr.gameRunning();
    },

    onKeyDown(event)
    {
        switch (event.keyCode) {
            case cc.macro.KEY.space:
                unit.SceneMgr.loadingScene('Hall');
                break;
            case cc.macro.KEY.s:
                uGS.Logic.log();
                break;
            default:
                break;
        }
    },

    onGameEvent(msg)
    {
        if (msg.type == uGS.GameState.start) {
            uLg.HallMgr.tip('游戏开始');
        }
        else if (msg.type == uGS.GameState.finish) {
            uLg.HallMgr.tip('游戏结束');
        }
    },
});