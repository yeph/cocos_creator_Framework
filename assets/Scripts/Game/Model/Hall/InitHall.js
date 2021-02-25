/*
 * @Author: your name
 * @Date: 2020-12-20 17:03:36
 * @LastEditTime: 2021-01-07 13:29:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\InitGame.js
 */

if (window.uLg == null) {
    window.uLg = {};
}

import RegDef from './RegDef';
uLg.RegDef = RegDef;
uLg.PoolID = RegDef.PoolID;
uLg.DlgID = RegDef.DlgID;

import HallMgr from './HallMgr';
uLg.HallMgr = HallMgr;

function __init__()
{
    unit.AudioMgr.setAudioPath('Audio');
    unit.SceneMgr.setLoading('Loading');
    unit.LoadMgr.setLoadConfigUrl('Unit/load_info');

    // 注册预制体
    unit.PoolMgr.registerPool(uLg.PoolID);

    // unit.DialogDef = uLg.DlgID;
    unit.DialogMgr.registerDialog(uLg.DlgID);

    // unit.MVMgr.findData()

    // unit.PoolMgr.debugPool();
};
__init__();