/*
 * @Author: your name
 * @Date: 2021-01-07 21:24:33
 * @LastEditTime: 2021-01-07 21:27:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Tool\UGameLog.js
 */

module.exports = {

    log(tag, ...subst)
    {
        this._writeLog('log', tag, ...subst);
    },

    warn(tag, ...subst)
    {
        this._writeLog('warn', tag, ...subst);
    },

    error(tag, ...subst)
    {
        this._writeLog('error', tag, ...subst);
    },

    _writeLog(type, tag, ...subst)
    {
        if (type == 'log') {
            console.log(tag, ...subst);
        } 
        else if (type == 'warn') {
            console.warn(tag, ...subst);
        }
        else if (type == 'error') {
            console.error(tag, ...subst);
        }
    },
};