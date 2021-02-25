/*
 * @Description: 

{
    "_notes_" : {
        "asset_type_enum" : ["Asset", "SpriteFrame", "Prefab", "SpriteAtlas", "SkeletonData"],
        "load_type_enum" : ["dir", "single"]
    },

    "Login" : [
        {"url":["Config"], "load_type" : "dir", "asset_type" : "JsonAsset", "isStatic" : 1},
        {"url":["Spine/yu1"], "load_type" : "single", "asset_type" : "SkeletonData", "isStatic" : 0},
        {"url":["Texture/soldier/qibing_down_go_green_00"], "load_type" : "single", "asset_type" : "SpriteAtlas"}
    ],

    "Hall" : [
        
    ]
}

 * @Author: jacklove
 * @Date: 2019-10-21 14:12:07
 * @LastEditors: jacklove
 * @LastEditTime: 2020-12-11 13:35:25
 */

module.exports = {
    m_loadResQueue : new Array(),   // 要加载的文件列表
    m_loadAmount : 0,
    m_loadIndex : 0,
    m_loadType : 'one',
    m_loadUseTime : 0,
    m_loadSucceedNum : 0,
    m_loadFailureNum : 0,
    m_completeFunc : null,
    m_progressFunc : null,

    m_load_config_url : 'Unit/load_info',

    setLoadConfigUrl(url)
    {
        this.m_load_config_url = url;
    },

    getLoadList(key, callback)
    {
        unit.ResMgr.loadStaticAsset(this.m_load_config_url, cc.JsonAsset, (res)=>{

            if (!res || !res.json[key]) {
                if (callback) { callback(null); }
                return;
            }

            // let data_info = res.json[key];
            // if (!data_info) {
            //     if (callback) { callback([]); }
            //     return;
            // }

            // let data_list = this._readLoadList(data_info);
            if (callback) { callback(res.json[key]); }
        });
    },

    startLoad(key, completeFunc, progressFunc, loadtype = 'frame')
    {
        this.getLoadList(key, (data_info)=>{

            if (!data_info) {
                if (completeFunc) { completeFunc(); }
                return;
            }

            let load_list = this._readLoadList(data_info);
            for (let i = 0; i < load_list.length; i++) {
                this.addRes(load_list[i]);
            }

            this.loadRes(completeFunc, progressFunc, loadtype);
        });
    },

    _readLoadList(data_info)
    {

        // res_data.url = load_data.url;
        // res_data.isStatic = false;
        // if (load_data.hasOwnProperty('isStatic')) 
        // {  
        //     res_data.isStatic = (load_data.isStatic > 0);
        // }
        // res_data.isDir = (load_data.load_type == 'dir');

        // let _type_ = cc.Asset; 
        // switch (load_data.asset_type) {
        //     case 'JsonAsset': _type_ = cc.JsonAsset; break;
        //     case 'TextAsset': _type_ = cc.TextAsset; break;
        //     case 'SpriteFrame': _type_ = cc.SpriteFrame; break;
        //     case 'SpriteAtlas': _type_ = cc.SpriteAtlas; break;
        //     case 'Prefab': _type_ = cc.Prefab; break;
        //     case 'SkeletonData': _type_ = sp.SkeletonData; break;
        //     // case 'JsonAsset': _type_ = cc.JsonAsset; break;
        //     // case 'JsonAsset': _type_ = cc.JsonAsset; break;
        //     // case 'JsonAsset': _type_ = cc.JsonAsset; break;
        //     default:
        //         break;
        // }

        // res_data.type = _type_;

        let load_list = [];

        for (let i = 0; i < data_info.length; i++) {
            const data = data_info[i];
            
            var base_load_info = {
                url : '',
                isStatic : false,
                isDir : (data.load_type == 'dir'),
            };

            if (data.hasOwnProperty('isStatic')) 
            {  
                base_load_info.isStatic = (data.isStatic > 0);
            }

            let urls = [];
            if (Array.isArray(data.url)) {
                urls = data.url;
            } else {
                urls = [data.url];
            }
            for (let j = 0; j < urls.length; j++) {
                const url = urls[j];
                let load_data = this._easyCopyObj(base_load_info);
                load_data.url = url;
                load_data.type = cc.Asset;

                load_list.push(load_data);
            }
        }

        return load_list;
    },
    
    // 清空加载列表
    clearQueue()
    {
        this.m_loadResQueue.length = 0;
    },

    stopLoading()
    {
        this.m_completeFunc = null;
        this.m_progressFunc = null;

        this.m_loadResQueue.length = 0;

        if (this.m_frameLoadHandler) {
            clearTimeout(this.m_frameLoadHandler);
        }
        this.m_frameLoadHandler = null;
    },

    isLoadingAsset()
    {
        return unit.ResMgr.getLoadingCount() > 0;
    },

    // 开始加载资源
    loadRes(completeFunc, progressFunc, loadtype = 'one')
    {
        this.m_completeFunc = completeFunc;
        this.m_progressFunc = progressFunc;

        this.m_loadSucceedNum = 0;
        this.m_loadFailureNum = 0;
        this.m_loadAmount = 0;
        this.m_loadUseTime = Date.now();

        if (this.m_loadResQueue.length <= 0) {
            this._loadEndInfo();
            if (this.m_progressFunc) {
                this.m_progressFunc(1);
            }
            if (this.m_completeFunc) {
                this.m_completeFunc();
            }
            return;
        }

        this.m_loadType = loadtype;
        if (loadtype == 'one') {
            this._loadOneByOne();
        } else {
            this._startLoadByFrame();
        }
    },

    // 开启按帧加载
    _startLoadByFrame()
    {
        this.m_loadIndex = 0;
        this.m_frames = cc.director.getTotalFrames();

        var self = this;
        function check_load() {
            if (cc.director.getTotalFrames() != self.m_frames) {
                self.m_frames = cc.director.getTotalFrames();
                for (let i = 0; i < 3; i++) {
                    self.loadByFrame();
                }
            }
            if (self.m_loadIndex < self.m_loadResQueue.length) {
                self.m_frameLoadHandler = setTimeout(check_load, cc.director.getDeltaTime());
            }
            else
            {
                self.m_frameLoadHandler = null;
            }
        }

        this.m_frameLoadHandler = setTimeout(check_load, cc.director.getDeltaTime());
    },

    _easyCopyObj(obj) 
    {
        var i;
        var o = Array.isArray(obj) ? [] : {};
        for (i in obj) {
            o[i] = typeof obj[i] === "Object" ? this._easyCopyObj(obj[i]) : obj[i];
        }
        return o;
    },

    // 添加要加载的资源
    addRes(data)
    {
        if (data == undefined || data == null ) {
            unit.error('load resource data is null');
            return;
        }

        // {"url":"Config", "load_type" : "dir", "asset_type" : "", "isStatic" : true},

        var load_data = this._easyCopyObj(data);
        this.m_loadResQueue.push(load_data);
    },

    // 按帧加载
    loadByFrame()
    {
        if (this.m_loadIndex >= this.m_loadResQueue.length) {
            return;
        }
        const load_data = this.m_loadResQueue[this.m_loadIndex];
        this.m_loadIndex++;
        this._loadSync(load_data);
    },

    // 一个一个加载
    _loadOneByOne()
    {
        const load_data = this.m_loadResQueue[this.m_loadAmount];
        this._loadSync(load_data);
    },

    _transformToResData(load_data)
    {
        // {"url":"Config", "load_type" : "dir", "asset_type" : "", "isStatic" : true},
        let res_data = {};
        res_data.url = load_data.url;
        res_data.isStatic = false;
        if (load_data.hasOwnProperty('isStatic')) 
        {  
            res_data.isStatic = (load_data.isStatic > 0);
        }
        res_data.isDir = (load_data.load_type == 'dir');

        let _type_ = cc.Asset; 
        switch (load_data.asset_type) {
            case 'JsonAsset': _type_ = cc.JsonAsset; break;
            case 'TextAsset': _type_ = cc.TextAsset; break;
            case 'SpriteFrame': _type_ = cc.SpriteFrame; break;
            case 'SpriteAtlas': _type_ = cc.SpriteAtlas; break;
            case 'Prefab': _type_ = cc.Prefab; break;
            case 'SkeletonData': _type_ = sp.SkeletonData; break;
            // case 'JsonAsset': _type_ = cc.JsonAsset; break;
            // case 'JsonAsset': _type_ = cc.JsonAsset; break;
            // case 'JsonAsset': _type_ = cc.JsonAsset; break;
            default:
                break;
        }

        res_data.type = _type_;

        return res_data;
    },

    // 异步加载
    _loadSync(load_data)
    {
        // let res_data = this._transformToResData(load_data);
        let res_data = load_data;

        unit.ResMgr.baseLoadAsset(res_data.url, res_data.type, 
            (obj)=>{
                this.m_loadAmount++;
                if (obj) { this.m_loadSucceedNum++; }
                else { this.m_loadFailureNum++; }
                this._checkComplete();
            }, 
            res_data.isDir, 
            res_data.isStatic
        );
    },

    // 检测是否加载完成
    _checkComplete()
    {
        if (this.m_progressFunc) {
            this.m_progressFunc(this.m_loadAmount / this.m_loadResQueue.length);
        }
        if (this.m_loadAmount >= this.m_loadResQueue.length) {
            this._loadEndInfo();
            if (this.m_completeFunc) {
                this.m_completeFunc();
            }
            if (this.m_frameLoadHandler) {
                clearTimeout(this.m_frameLoadHandler);
            }
            this.m_frameLoadHandler = null;
        }
        else
        {
            if (this.m_loadType == 'one') {
                this._loadOneByOne();
            }
        }
    },

    _loadEndInfo()
    {
        var useTime = Date.now() - this.m_loadUseTime;
        unit.log('加载用时: ' + useTime / 1000 + 's');
        var load_info = {
            load_succeed : this.m_loadSucceedNum,
            load_failure : this.m_loadFailureNum,
            load_total : this.m_loadResQueue.length,
        }
        unit.log(load_info);
    },

};