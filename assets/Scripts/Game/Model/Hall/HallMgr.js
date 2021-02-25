/*
 * @Author: your name
 * @Date: 2021-01-06 18:20:12
 * @LastEditTime: 2021-01-09 12:33:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Game\GameMgr.js
 */
module.exports = {

    tip(text, delay = 3)
    {
        unit.DialogMgr.showDialog(uLg.DlgID.dlg_toast, {msg : text, type : 'center', delay : delay, });
    },
};