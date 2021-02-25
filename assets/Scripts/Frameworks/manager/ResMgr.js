/*
 * @Author: jacklove
 * @Date: 2020-07-22 10:37:15
 * @LastEditTime: 2020-11-10 09:44:18
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\manager\ResMgr.js
 */ 

module.exports = {

    _isDabug : true,
    _debug_list : new Object(),
    _loadingCount : 0,
    _cache_list : new Array(), // 已动态加载的资源
    _static_list : new Array(), // 静态加载的资源

    getLoadingCount()
    {
        return this._loadingCount;
    },

    webImage(url, node)
    {
        cc.assetManager.loadRemote(url + '', {ext: '.png'}, (err, texture) => {
            // console.error(err, texture, node)
            if (!err && cc.isValid(node)) {
                // let sp = node;
                // sp.spriteFrame = new cc.SpriteFrame(texture);
                // sp.type = cc.Sprite.Type.SIMPLE;
                // sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;

                this._repSpriteTexture(node.getComponent(cc.Sprite), 'spriteFrame', new cc.SpriteFrame(texture));
            }
        });
    },

    getTemp(url)
    {
        if (!cc.assetManager.cacheManager) {
            return null;
        }
        var cachePath = cc.assetManager.cacheManager.getCache(url);
        return cachePath;
    },

    remote(url, ext)
    {
        cc.assetManager.loadRemote(url, { cacheEnabled: true, ext: ext }, (e, a)=>{
            // console.error(e, a);
            // var cachePath = cc.assetManager.cacheManager.getCache(a.nativeUrl);
            // console.warn(cc.assetManager);
        });
    },

    getPrefab(url, callback)
    {
        this.loadAsset(url, cc.Prefab, (prefab) => {
            // this.instantiate(prefab, callback);
            let node_prefab = cc.instantiate(prefab);
            if (callback) { callback(node_prefab); }
        });
    },

    _repSpriteTexture(target, sprite_key, sprite_frame) {
        if (!cc.isValid(target)) { return; }
        if (!sprite_frame) { return; }
        target[sprite_key] = sprite_frame;
    },

    _repSkeletonData(skeleton, skeleton_data) {
        if (!cc.isValid(skeleton)) { return; }
        if (!skeleton || !skeleton_data) { return; }
        skeleton.skeletonData = skeleton_data;
    },

    // 替换spine动画
    replaceSkel(target, url, callback)
    {
        this.replaceSkeletonData(target, url, callback);
    },

    // 替换spine动画
    replaceSkeletonData(target, url, callback)
    {
        if (!cc.isValid(target)) { console.log('参数错误'); return; }

        let skeleton = target.getComponent(sp.Skeleton);
        if (!skeleton) { console.log('目标节点没有Skeleton组件'); return; }
        
        this.loadAsset(url, sp.SkeletonData, (skeletonData) => {
            this._repSkeletonData(skeleton, skeletonData);
            if (callback) { callback(skeletonData); }
        })
    },

    // 替换纹理
    replaceFrame(target, atlasName, frameName, callback) {
        if (!cc.isValid(target)) { console.log('参数错误'); return; }

        let sprite = target.getComponent(cc.Sprite);
        if (!sprite) { console.log('目标节点没有Sprite组件'); return; }

        // if (atlasName && frameName) {
        //     this.loadAsset(atlasName, cc.SpriteAtlas, (atlas) => {
        //         if (atlas) {
        //             var sprite_frame = atlas.getSpriteFrame(frameName);
        //             this._repSpriteTexture(sprite, 'spriteFrame', sprite_frame);
        //         }
        //         // _repSpriteTexture(sprite, "spriteFrame", sprite_frame);
        //         if (callback) { callback(); }
        //     });            
        // } else {
        //     this.loadAsset(atlasName, cc.SpriteFrame, (sprite_frame) => {
        //         this._repSpriteTexture(sprite, 'spriteFrame', sprite_frame);
        //         if (callback) { callback(); }
        //     });
        // }

        // 先查找有没有加载进来资源
        let atlas = this.getAsset(atlasName, cc.SpriteAtlas);
        if (atlas) {
            var sprite_frame = atlas.getSpriteFrame(frameName);
            if (sprite_frame) {
                this._repSpriteTexture(sprite, 'spriteFrame', sprite_frame);
                if (callback) { callback(); }
                return;
            }
        } else {
            let sprite_frame = this.getAsset(atlasName + '/' + frameName, cc.SpriteFrame);
            if (sprite_frame) {
                this._repSpriteTexture(sprite, 'spriteFrame', sprite_frame);
                if (callback) { callback(); }
                return;
            }
        }

        // 尝试加载
        this.loadAsset(atlasName, cc.SpriteAtlas, (atlas) => {
            if (atlas) {// 合图，尝试获取精灵帧
                var sprite_frame = atlas.getSpriteFrame(frameName);
                if (sprite_frame) {
                    this._repSpriteTexture(sprite, 'spriteFrame', sprite_frame);
                }
                if (callback) { callback(); }
            }
            else
            {// 尝试获取散图
                this.loadAsset(atlasName + '/' + frameName, cc.SpriteFrame, (sprite_frame) => {
                    if (sprite_frame) {
                        this._repSpriteTexture(sprite, 'spriteFrame', sprite_frame);
                    }
                    if (callback) { callback(); }
                });
            }
        });         
    },

    getAsset(url, type = cc.Asset)
    {
        var res = cc.resources.get(url, type);
        if (res) {
            return res;
        }
        return null;
    },

    // 加载资源
    loadAsset(url, type = cc.Asset, callback)
    {
        var res = cc.resources.get(url, type);
        if (res) {
            if (callback) { callback(res); }
            return;
        }

        this.baseLoadAsset(url, type, callback, false, false);
    },

    // 加载静态资源
    loadStaticAsset(url, type = cc.Asset, callback)
    {
        var res = cc.resources.get(url, type);
        if (res) {
            if (callback) { callback(res); }
            return;
        }
        this.baseLoadAsset(url, type, callback, false, true);
    },

    baseLoadAsset(url, type = cc.Asset, callback, isDir = false, isStatic = false)
    {
        this._debug_load_('begin', url);
        this._loadingCount++;

        if (isDir == true) 
        { 
            cc.resources.loadDir(url, type, (err, res) => { 
                this._loadResult(url, type, err, res, callback, isStatic); 
            }); 
        }
        else 
        { 
            cc.resources.load(url, type, (err, res) => { 
                this._loadResult(url, type, err, res, callback, isStatic); 
            }); 
        }

    },

    _loadResult(url, type, err, res, callback, isStatic)
    {
        this._loadingCount--;
        // console.error(type);
        this._debug_load_('end', url, err);
        if (err) {
            if (callback) { callback(null); }
            // console.error('load ' + url + '--->', err); 
        }
        else {
            if (isStatic == false) {
                this._cache_list.push({url : url, type : type});
            } else {
                this._static_list.push({url : url, type : type});
            }
            if (callback) { callback(res); }
        } 
    },

    // 释放动态资源
    releaseZero()
    {
        for (let i = 0; i < this._cache_list.length; i++) {
            const data = this._cache_list[i];
            this.releaseAsset(data.url, data.type);
        }
        this._cache_list.length = 0;
    },

    // 释放静态资源
    releaseStaticZero()
    {
        for (let i = 0; i < this._static_list.length; i++) {
            const data = this._static_list[i];
            this.releaseAsset(data.url, data.type);
        }
        this._static_list.length = 0;
    },

    // 释放资源
    releaseAsset(url, type = cc.Asset)
    {
        cc.resources.release(url, type);
    },

    _debug_load_(debug_type, url, err)
    {
        if (!this._isDabug) { return; }
        
        let d_key = url + '';
        if (debug_type == 'begin') {
            this._debug_list[d_key] = {start_time : Date.now()};
        }
        else
        {
            if (this._debug_list[d_key]) {
                var delay_time = (Date.now() - this._debug_list[d_key].start_time);
                var result = (err == null) ? '成功': '失败';
                console.log(`加载[${url}]${result} 用时${delay_time}ms`);
                delete this._debug_list[d_key];
            }
        }
    },

    _logger()
    {
        console.warn(cc.assetManager.assets);
        // console.warn(cc.assetManager.dependUtil);
    },
}