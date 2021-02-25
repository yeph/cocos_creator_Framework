/*
 * @Author: your name
 * @Date: 2021-01-07 13:39:51
 * @LastEditTime: 2021-01-07 13:46:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Event\UEventMgr.js
 */

function e_listen(group, type, callback, cls, priority = 0) {
    // console.error(type);
    // priority 越小越先触发
    if (group == null || group == undefined) {
        console.error('listen group is null');
        return;
    }

    if (type == null || type == undefined) {
        console.error('listen type is null');
        return;
    }
    var sub_cache = group.event_cache[type] || [];
    var ievent = {callback : callback.bind(cls), cls : cls, priority : priority};
    // if(!event){
    // 	event = [];
    // 	this.events[type] = event;
    // }
    if (priority > 0) {
        let isPush = true;
        for(let i = sub_cache.length - 1; i >= 0; i--) {
            if ( sub_cache[i].priority > priority) {
                sub_cache.splice(i + 1, 0, ievent);
                isPush = false;
                break;
            }
        }
        if (isPush) {
            sub_cache.splice(0, 0, ievent);
        }
    } else {
        sub_cache.push(ievent);
    }
    group.event_cache[type] = sub_cache;
    return callback;
    //console.log('监听一个事件 type=', type, 'listen=', listen);            
};

function e_dispatch(group, type, data) {
    if (!type) {
        return;
    }
    let sub_cache = group.event_cache[type];
    if (!sub_cache) {
        return;
    }

    let haveInvalid = false;

    for (let i = 0; i < sub_cache.length; i++) {
        let ievent = sub_cache[i];
        if (cc.isValid(ievent.cls, true)) {
            ievent.callback(data);
        }
        else{
            haveInvalid = true;
        }
    }

    if (haveInvalid) {
        e_removeInvalid(group);
    }
};

function e_removeInvalid(group) {
    for (const type in group.event_cache) {
        let sub_cache = group.event_cache[type];
        for (let i = sub_cache.length - 1; i >= 0; i--) {
            const cls = sub_cache[i].cls;
            if (cc.isValid(cls) == false) {
                sub_cache.splice(i, 1);
            }
        }
        if (sub_cache.length == 0) {
            delete group.event_cache[type];
        }
    }
    // this.print();
};

function e_remove(group, type, callback) {
    if (!type || !callback) {
        return;
    }
    let sub_cache = group.event_cache[type];
    if (!sub_cache) {
        return;
    }
    for (let i = 0; i < sub_cache.length; i++) {
        if (sub_cache[i].callback === callback) {
            sub_cache.splice(i, 1);
            break;
        }
    }
    if (sub_cache.length == 0) {
        delete group.event_cache[type];
    }
};

function e_removeAll(group, type) {
    if (!type) {
        return;
    }
    let sub_cache = group.event_cache[type];
    if (!sub_cache) {
        return;
    }
    delete group.event_cache[type];
};

module.exports = {

    group_data : new Object(), // 分组列表

    __init__()
    {
        this.internalGroup('default'); // 新建默认分组
    },

    //-------------------------- default --------------------------//

    // 系统默认监听
    listen(type, callback, cls, priority = 0)
    {
        e_listen(this.getGroup('default'), type, callback, cls, priority);
    },
    
    // 系统默认分发消息
    dispatch(type, data)
    {
        e_dispatch(this.getGroup('default'), type, data);
    },
    
    // 系统默认移除监听
    remove(type, callback)
    {
        e_remove(this.getGroup('default'), type, callback);
    },

    // 移除所有默认系统监听
    removeAll()
    {
        e_removeAll(this.getGroup('default'));
    },

    //-------------------------- custom --------------------------//

    // // 自定义监听
    // listen_g(group_name, type, callback, cls, priority = 0)
    // {
    //     e_listen(this.getGroup(group_name), type, callback, cls, priority);
    // },
    
    // // 自定义分发消息
    // dispatch_g(group_name, type, data)
    // {
    //     e_dispatch(this.getGroup(group_name), type, data);
    // },
    
    // // 自定义移除监听
    // remove_g(group_name, type, callback)
    // {
    //     e_remove(this.getGroup(group_name), type, callback);
    // },

    // // 移除所有自定义监听
    // removeAll_g(group_name)
    // {
    //     e_removeAll(this.getGroup(group_name));
    // },

    // 自定义监听safe
    listen_s(group_name, type, callback, cls, priority = 0)
    {
        if (!this.getGroup(group_name)) { this.newGroup(group_name); }
        e_listen(this.getGroup(group_name), type, callback, cls, priority);
    },
    
    // 自定义分发消息safe
    dispatch_s(group_name, type, data)
    {
        if (!this.getGroup(group_name)) { this.newGroup(group_name); }
        e_dispatch(this.getGroup(group_name), type, data);
    },
    
    // 自定义移除监听safe
    remove_s(group_name, type, callback)
    {
        if (!this.getGroup(group_name)) { this.newGroup(group_name); }
        e_remove(this.getGroup(group_name), type, callback);
    },

    // 移除所有自定义监听safe
    removeAll_s(group_name)
    {
        if (!this.getGroup(group_name)) { return; }
        e_removeAll(this.getGroup(group_name));
        this.removeGroup(group_name);
    },

    //-------------------------- group --------------------------//

    // 移除监听组
    removeGroup(group_name)
    {
        if (group_name == 'default') {
            console.error('不能移除系统监听组');
            return null;
        }
        delete this.group_data[group_name];
    },

    // 获得监听组
    getGroup(group_name)
    {
        return this.group_data[group_name];
    },
    
    // 新建监听组
    newGroup(group_name)
    {
        if (group_name == 'default') {
            console.error('不能定义系统监听组名字');
            return null;
        }
        return this.internalGroup(group_name);
    },

    // 内置
    internalGroup(group_name)
    {
        var group = new Object();
        group.event_cache = new Object();

        this.group_data[group_name] = group;
        return group;
    },
};

module.exports.__init__();