/*
 * @Author: your name
 * @Date: 2021-01-07 13:29:35
 * @LastEditTime: 2021-01-17 13:51:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\InitGameSystem.js
 */


if (window.uGS == null) {
    window.uGS = {};
}

//----------------------------- tool -----------------------------//

if (uGS.tool == null) {
    uGS.tool = {};
}

import UGameLog from './Tool/UGameLog';
uGS.tool.log = UGameLog.log.bind(UGameLog);
uGS.tool.warn = UGameLog.warn.bind(UGameLog);
uGS.tool.error = UGameLog.error.bind(UGameLog);

import URandom from './Tool/URandom';
uGS.tool.r2I = URandom.r2I.bind(URandom);
uGS.tool.seed = URandom.seed.bind(URandom);
uGS.tool.rand = URandom.rand.bind(URandom);

import GameTool from './Tool/GameTool';
uGS.tool.trim = GameTool.trim.bind(GameTool);

import Formula from './Tool/Formula';
uGS.Formula = Formula;

//----------------------------- core -----------------------------//

import UGameEvent from './Event/UGameEvent';
uGS.EventMgr = UGameEvent;

import TriggerMgr from './Trigger/TriggerMgr';
uGS.TriggerMgr = TriggerMgr;

import AIMgr from './AI/AIMgr';
uGS.AIMgr = AIMgr;

import AbilityMgr from './Ability/AbilityMgr';
uGS.AbilityMgr = AbilityMgr;

import ActionMgr from './Action/ActionMgr';
uGS.ActionMgr = ActionMgr;

import ActorMgr from './Actor/ActorMgr';
uGS.ActorMgr = ActorMgr;

import BattleMgr from './Battle/BattleMgr';
uGS.BattleMgr = BattleMgr;

import UGameLogic from './Logic/UGameLogic';
uGS.Logic = UGameLogic;

import USelectHelper from './Logic/USelectHelper';
uGS.USelectHelper = USelectHelper;

import UGameFormula from './Logic/UGameFormula';
uGS.UGameFormula = UGameFormula;

//----------------------------- definition -----------------------------//

import UGameDef from './Def/UGameDef';
uGS.UGameDef = UGameDef;
uGS.ActorState = UGameDef.ActorState;
uGS.GameState = UGameDef.GameState;
uGS.AttriType = UGameDef.AttriType;
uGS.OriginType = UGameDef.OriginType;

import UEventTypeDef from './Event/UEventTypeDef';
uGS.EventType = UEventTypeDef;

import TriggerDef from './Trigger/TriggerDef';
uGS.TriggerDef = TriggerDef;
uGS.TriggerType = TriggerDef.TriggerType;

//----------------------------- debug -----------------------------//

import UDebug from './Debug/UDebug';
uGS.UDebug = UDebug;


uGS.init = function () {
    uGS.AIMgr.__init__();
    uGS.Logic.__init__();
    // uGS.AbilityMgr.loadConfig('Config/skill');
    uGS.AbilityMgr.init('Config/skill_all');
}