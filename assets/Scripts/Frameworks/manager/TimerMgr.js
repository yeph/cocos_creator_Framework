/*
 * @Author: jacklove
 * @Date: 2020-03-26 13:47:34
 * @LastEditTime: 2020-03-26 14:25:17
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\manager\TimerMgr.js
 */
module.exports = {

    m_timer_list : [],

    createTimer(key, delay, callback)
    {
        var timer = {
            key : key,
            callback : callback,
            delay : delay,
            handler_id : 0,
            call_num : 0,
        };
        this.m_timer_list.push(timer);

        timer.handler_id = setTimeout(this._callback_.bind(this), delay, key);
    },

    _callback_(key)
    {
        var _timer = this.getTimer(key);
        if (_timer) {
            if (_timer.callback) {
                _timer.call_num++;
                _timer.callback(_timer);
            }
            _timer.handler_id = setTimeout(this._callback_.bind(this), _timer.delay, key);
        }
    },

    getTimer(key)
    {
        for (let i = 0; i < this.m_timer_list.length; i++) {
            const timer = this.m_timer_list[i];
            if (timer.key == key) {
                return timer;
            }
        }
        return null;
    },

    removeTimer(key)
    {
        for (let i = 0; i < this.m_timer_list.length; i++) {
            const timer = this.m_timer_list[i];
            if (timer.key == key) {
                delete this.m_timer_list[i];
                this.m_timer_list.splice(i, 1);
                break;
            }
        }
    },

    clearTimer(key)
    {
        this.stopTimer(key);
        this.removeTimer(key);
    },

    stopTimer(key)
    {
        var timer = this.getTimer(key);
        if (timer) {
            clearTimeout(timer.handler_id);
        }
    },

};