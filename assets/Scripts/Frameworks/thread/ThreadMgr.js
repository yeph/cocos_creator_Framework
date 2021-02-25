/*
 * @Description: In User Settings Edit
 * @Author: jacklove
 * @Date: 2019-09-02 13:54:22
 * @LastEditors: jacklove
 * @LastEditTime: 2019-11-11 16:11:23
 */


module.exports = {
    m_threadList : new Array(),

    create(thread_name)
    {
        // 创建协程
        let IThread = require("IThread")
        var thread = new IThread();
        this._push(thread, thread_name);
        return thread;
    },

    _push(thread, thread_name)
    {
        this.m_threadList.push({thread : thread, thread_name : thread_name, });
    },

    get(thread_name)
    {
        for (let index = 0; index < this.m_threadList.length; index++) {
            const _thread_name_ = this.m_threadList[index].thread_name;
            const _thread_ = this.m_threadList[index].thread;
            if (_thread_name_ == thread_name) {
                if (_thread_.m_done == true) {
                    return null;
                }
                return this.m_threadList[index].thread;
            }
        }
        return null;
    },

    event(event_name)
    {
        for (let index = this.m_threadList.length - 1; index >= 0; index--) {
            const _thread_ = this.m_threadList[index].thread;
            if (_thread_.m_done == false) {
                _thread_.event(event_name);
            }
            else
            {
                this.m_threadList.splice(index, 1);
            }
        }
    },

    removeByName(thread_name)
    {
        for (let index = 0; index < this.m_threadList.length; index++) {
            const _thread_info = this.m_threadList[index];
            if (_thread_info.thread_name == thread_name) {
                delete this.m_threadList[index].thread;
                this.m_threadList.splice(index, 1);
                break;
            }
        }
        // console.error(this.m_threadList);
    },

    remove(thread)
    {
        for (let index = 0; index < this.m_threadList.length; index++) {
            const _thread_ = this.m_threadList[index].thread;
            if (_thread_ == thread) {
                delete this.m_threadList[index].thread;
                this.m_threadList.splice(index, 1);
                break;
            }
        }
    },

    removeDead()
    {
        for (let index = this.m_threadList.length - 1; index >= 0; index--) {
            const _thread_ = this.m_threadList[index].thread;
            if (_thread_.m_done == true) {
                this.m_threadList.splice(index, 1);
            }
        }
    },
};
