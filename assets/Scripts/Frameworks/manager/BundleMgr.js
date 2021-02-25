/*
 * @Author: jacklove
 * @Date: 2020-07-27 13:39:42
 * @LastEditTime: 2020-07-29 10:50:45
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\manager\BundleMgr.js
 */ 

module.exports = {

    loadPack(url, callback)
    {
        cc.assetManager.loadBundle(url, null, (e, b)=>{
            console.error(b.base, b.name);
            if (e) {
                console.error(e);
            } else {
                console.warn(b);
                if (callback) { callback(b); }
            }
        });
    },

    getPack(pack_name)
    {
        return cc.assetManager.getBundle(pack_name);
    },

    isLoadPack(pack_name)
    {
        var pack_bundle = this.getPack(pack_name);
        return pack_bundle != null;
    },

    isCachePack(pack_name)
    {
        if (!cc.assetManager.cacheManager) { return false; }
        var cache = cc.assetManager.cacheManager.getCache(pack_name);
        unit.log('isCachePack', cache);
        return cache != null;
    },

    loadPackScene(pack_name, scene_name, callback)
    {
        var pack_bundle = this.getPack(pack_name);

        console.error('loadPackScene', pack_bundle != null);

        if (!pack_bundle) {
            this.loadPack(pack_name, ()=>{
                this._loadPackScene(pack_name, scene_name, callback);
            });
            return;
        }
        this._loadPackScene(pack_name, scene_name, callback);
    },

    _loadPackScene(pack_name, scene_name, callback)
    {
        var pack_bundle = this.getPack(pack_name);
        console.error('_loadPackScene', pack_bundle != null);
        if (!pack_bundle) {
            return;
        }
        pack_bundle.loadScene(scene_name, (err, asset) => {
            if (err) {
                cc.log('Error url [' + err + ']');
                // if (callback) { callback(asset); }
                return;
            }
            if (callback) { callback(asset); }
        });
    },
};