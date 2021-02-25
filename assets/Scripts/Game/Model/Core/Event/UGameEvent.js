/*
 * @Author: your name
 * @Date: 2021-01-07 13:39:51
 * @LastEditTime: 2021-01-17 15:25:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Event\UGameEvent.js
 */

let UEventMgr = require('./UEventMgr')
let UEventTypeDef = require('./UEventTypeDef')

module.exports = {

    // 系统默认监听
    listen(callback, cls, priority = 0)
    {
        UEventMgr.listen_s(UEventTypeDef.GLOBAL, '__global_event__', callback, cls, priority);
    },
    
    // 系统默认分发消息
    dispatch(type, data)
    {
        UEventMgr.dispatch_s(UEventTypeDef.GLOBAL, '__global_event__', {type : type, data : data, });
    },
    
    // 系统管理器监听
    listen_mgr(group, type, callback, cls, priority = 0)
    {
        UEventMgr.listen_s(group, type, callback, cls, priority);
    },
    
    // 系统管理器分发消息
    dispatch_mgr(group, type, data)
    {
        UEventMgr.dispatch_s(group, type, data);
        this.dispatch(type, data);
    },
};