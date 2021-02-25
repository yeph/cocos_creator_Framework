/*
 * @Description: 预制体池管理器
 * @Author: jacklove
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-12 08:51:20
 * @LastEditTime: 2021-01-04 16:27:14
 */

let PoolDef = require("PoolDef")

module.exports = {
    _pools_ : {},
    _debug_ : true,
    m_register_tab_name : 'Unit/unit_register', // 注册表名字
    m_pool_list : {},
    
    init()
    {
        // // cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {

        //     cc.resources.load(this.m_register_tab_name, cc.JsonAsset, (err, res) => {
        //         // console.error(error, res);
        //         if (err) { return; }
        //         // cc.log(JSON.stringify(res.json));
        //         this.m_pool_list = res.json;
        //         this._initToPool();
        //     });
        // // });
    },
    __init__()
    {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.beforeSceneLoading.bind(this));
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.afterSceneLaunch.bind(this));
    },

    beforeSceneLoading()
    {
        // console.warn('beforeSceneLoading');
    },

    afterSceneLaunch()
    {
        this.clearAllPool();
    },

    debugPool()
    {
        this._log_('debugPool', this._pools_);
    },

    _initToPool()
    {
        // for (const url in this.m_pool_list) {
        //     this.initPool(url, url);
        // }
    },

    registerPool(id_map)
    {
        PoolDef = cc.Enum(id_map);
        for (const pool_id in PoolDef) {
            const url = PoolDef[pool_id];
            this.initPool(pool_id, url);
        }
    },

    // 初始化对象池
    initPool(poolname, url)
    {
        var poolObj = this._pools_[poolname];
        if (poolObj == null) {
            poolObj = new Object();
            poolObj.pool = new cc.NodePool();       // 对象池
            poolObj.url = url;                      // 预制体url
            poolObj.used = new Array();             // 被使用的预制体
            poolObj.collect = new Array();          // 收集信息

            this._pools_[poolname] = poolObj;
        }
        else
        {
            // this.clearPool(poolname);
            poolObj.url = url;
            poolObj.collect = new Array();
        }
        
        this._collect(poolname, 'init');

        // this._log_('register[%s][%s]', poolname, url);
    },

    // 获得对象节点
    getPerfab(poolname, callback)
    {
        // console.error('poolname', poolname);
        var poolObj = this._pools_[poolname];

        if (poolObj == null) {
            if (callback) { callback(null); }
            return;
        }

        let _prefab_node_ = poolObj.pool.get();
        if (!cc.isValid(_prefab_node_)) {
            unit.ResMgr.getPrefab(poolObj.url, (_prefab_node_) => {
                if (cc.isValid(_prefab_node_)) {
                    var poolUnit = _prefab_node_.getComponent('PoolUnit');
                    if (poolUnit) {
                        poolUnit.setPoolName(poolname);
                    }                    
                }

                poolObj.used.push(_prefab_node_);
                if (callback) { callback(_prefab_node_); }
                this._collect(poolname, 'new');
            });
            return;
        }

        poolObj.used.push(_prefab_node_);
        if (callback) { callback(_prefab_node_); }
        this._collect(poolname, 'get');
    },

    // 回收对象
    recoveryPerfab(poolname, prefabNode)
    {
        if (this._pools_[poolname] == null) {
            return null;
        }
        if (cc.isValid(prefabNode)) {// 节点没有被销毁才能被回收
            this._pools_[poolname].pool.put(prefabNode);
        }
        this.removeUsedPerfab(poolname, prefabNode);
        this._collect(poolname, 'recovery');
    },

    // 回收对象
    recoveryUnit(prefabNode)
    {
        var poolUnit = prefabNode.getComponent('PoolUnit');
        if (poolUnit == null || poolUnit == undefined) {
            console.error('预制体没有挂 PoolUnit 脚本，不能使用 PoolMgr.recoveryUnitPerfab 回收');
            return;
        }

        this.recoveryPerfab(poolUnit.getPoolName(), prefabNode);
    },

    // 销毁对象
    destoryPrefab(prefabNode)
    {
        unit.ResMgr.destroy(prefabNode);
    },

    clearAllPool()
    {
        // console.warn('clearAllPool');
        for (const poolname in this._pools_) {
            const poolObj = this._pools_[poolname];
            poolObj.pool.clear();
            poolObj.pool = null;
            poolObj.pool = new cc.NodePool();       // 对象池
            poolObj.used = null;
            poolObj.used = new Array();             // 被使用的预制体
            // poolObj.pool.clear();
            // poolObj.used.length = 0;
            this._collect(poolname, 'clear');
        }

        for (const poolname in this._pools_) {
            const poolObj = this._pools_[poolname];
            poolObj.collect = new Array();
        }
    },

    // 清理对象池
    clearPool(poolname)
    {
        var poolObj = this._pools_[poolname];
        if (poolObj && poolObj.url) {
            this._collect(poolname, 'clear');
            
            poolObj.pool.clear();
            poolObj.used.length = 0;
            // 此处不能清理[收集器]里的内容，因为还要查看
        }
    },

    // 获得正在使用的对象
    getUsedPerfab(poolname)
    {
        if (this._pools_[poolname] == null) {
            return new Array();
        }
        return this._pools_[poolname].used;
    },

    // 回收所有正在使用的预制体
    recAllUsedPerfab(poolname)
    {
        var poolObj = this._pools_[poolname];
        if (poolObj) {
            for (let index = poolObj.used.length - 1; index >= 0; index--) {
                const _prefab_node_ = poolObj.used[index];
                this.recoveryUnit(_prefab_node_);
            }
        }
    },

    // 节点被场景直接销毁，所以要移出正在使用的列表
    removeUsedPerfab(poolname, prefabNode)
    {
        if (this._pools_[poolname] == null) {
            return true;
        }

        for (let index = this._pools_[poolname].used.length - 1; index >= 0; index--) {
            const _prefab_node_ = this._pools_[poolname].used[index];
            if (_prefab_node_ == prefabNode) {
                this._pools_[poolname].used.splice(index, 1);
                return true;
            }
        }

        return false;
    },

    getCollect(poolname)
    {
        if (this._pools_[poolname] == null) {
            return new Array();
        }
        return this._pools_[poolname].collect;
    },

    _log_(message, ...p)
    {
        if (this._debug_) {
            console.log(message, ...p);
        }
    },

    //----------------------------- 收集器 ----------------------------//

    _collect(poolname, type)
    {// type : 'init','get','recovery','clear','new'
        var poolObj = this._pools_[poolname];
        if (poolObj == null) {
            return;
        }

        // var collect = poolObj.collect;
        // poolObj = this._pools_[poolname];

        switch (type) {
            case 'init':
            {
                this._set_collect_(poolObj.collect, 'initCount', poolObj.pool.size());
                // this._set_collect_(poolObj.collect, '_url', poolObj.url);
                break;
            }
            case 'get':
            {
                var count = Number(this._get_collect_(poolObj.collect, 'getCount', 0));
                this._set_collect_(poolObj.collect, 'getCount', ++count);

                this._set_collect_(poolObj.collect, 'usedCount', poolObj.used.length);

                var count2 = Number(this._get_collect_(poolObj.collect, 'usedMax', 0));
                if (count2 < poolObj.used.length) {
                    count2 = poolObj.used.length;
                }
                this._set_collect_(poolObj.collect, 'usedMax', count2);
                break;
            }
            case 'new':
            {
                var count = Number(this._get_collect_(poolObj.collect, 'newCount', 0));
                this._set_collect_(poolObj.collect, 'newCount', ++count);
                break;
            }
            case 'recovery':
            {
                this._set_collect_(poolObj.collect, 'usedCount', poolObj.used.length);

                var count = Number(this._get_collect_(poolObj.collect, 'recCount', 0));
                this._set_collect_(poolObj.collect, 'recCount', ++count);
                break;
            }
            case 'clear':
            {
                this._set_collect_(poolObj.collect, 'poolCount', poolObj.pool.size());
                this._set_collect_(poolObj.collect, 'usedCount', poolObj.used.length);
                break;
            }
        
            default:
                break;
        }
    },

    _set_collect_(collect, key, value)
    {
        if (!collect.hasOwnProperty(key)) {
            collect[key] = value;
        }
        else {
            collect[key] = value;
        }
    },

    _get_collect_(collect, key, value)
    {
        if (!collect.hasOwnProperty(key)) {
            collect[key] = value;
        }
        return collect[key];
    },
    
};

module.exports.__init__();