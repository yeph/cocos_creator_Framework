/*
 * @Author: your name
 * @Date: 2021-01-07 22:42:32
 * @LastEditTime: 2021-01-17 16:14:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Battle\BattleMgr.js
 */
module.exports = {

    m_battle_state : 'wait',
    m_battle_speed : 1,

    setState(state)
    {
        this.m_battle_state = state;
        uGS.EventMgr.dispatch(state);
    },

    setSeed(seed)
    {
        if (seed == null) {
            seed = Date.now();
        }
        uGS.tool.seed(seed);
        uGS.tool.warn('game_seed', seed);
    },

    gameWait()
    {
        this.m_battle_state = uGS.GameState.wait;
    },

    gameStart()
    {
        this.setState(uGS.GameState.start);
        this.setState(uGS.GameState.running);
    },

    isGameRunning()
    {
        return this.m_battle_state == uGS.GameState.running;
    },

    gameRunning()
    {
        this.setState(uGS.GameState.running);
    },

    gameFinish()
    {
        this.setState(uGS.GameState.finish);
    },

    gameResume()
    {
        this.setState(uGS.GameState.resume);
    },

    gamePause()
    {
        this.setState(uGS.GameState.pause);
    },

    getBattleSpeed()
    {
        return this.m_battle_speed;
    },

    setBattleSpeed(speed)
    {
        this.m_battle_speed = speed;
    },

    prepare(info)
    {
        let list = uGS.ActorMgr.getActors();
        for (let i = 0; i < list.length; i++) {
            const actor = list[i];
            uGS.Logic.join(actor);
        }

        let speed = 1;
        if (info.hasOwnProperty('speed')) {
            speed = info.speed;
        }

        let seed = null;
        if (info.hasOwnProperty('seed')) {
            seed = info.seed;
        }

        this.setBattleSpeed(speed);
        this.setSeed(seed);
    },

    clearAll()
    {
        uGS.Logic.clearAll();
        uGS.ActorMgr.clearAll();
        uGS.AbilityMgr.clearAll();
    },
    
    tick(dt)
    {
        if (this.m_battle_state != uGS.GameState.running) {
            return;
        }

        let _dt = 0.0167; // 固定帧率
        let delay = _dt * this.m_battle_speed;

        uGS.Logic.tick(delay);
        uGS.TriggerMgr.runTriggerImmediate();

        let isEnd = uGS.Logic.checkEnd();
        if (isEnd) {
            uGS.Logic.log();
            this.gameFinish();
        }
    },
};