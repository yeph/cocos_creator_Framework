/*
 * @Author: jacklove
 * @Date: 2020-11-05 14:48:43
 * @LastEditTime: 2021-01-03 13:56:48
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\advert\ADMgr.js
 */

let ADDef = require('./ADDef')

module.exports = {

    _config : {},
    _platform_list_ : {},
    _platform_name_ : '',

    __init__()
    {
        // cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
            this.loadConfig('ad_info');
        // });
    },

    init()
    {
        this.__init__();
    },

    initPlatforms()
    {
        let MiniVivo = require('./platform/MiniVivo');
        this.pushPlatform(new MiniVivo(ADDef.vivo_mini));
    },

    pushPlatform(platform)
    {
        this._platform_list_[platform.getPlatform()] = platform;
    },

    getPlatform()
    {
        if (this._platform_list_.hasOwnProperty(this._platform_name_)) {
           return this._platform_list_[this._platform_name_]; 
        }
        return null;
    },

    setPlatName(name)
    {
        this._platform_name_ = name;
    },

    listen(type, callback, cls, priority)
    {
        unit.EventMgr.listen_s('__ADMgr__', type, callback, cls, priority);
    },

    dispatch(type, data)
    {
        unit.EventMgr.dispatch_s('__ADMgr__', type, data);
    },

    loadConfig(file_path)
    {
        cc.resources.load(file_path, cc.JsonAsset, (err, res) => {
            // console.error(err, res);
            if (err) { return; }
            // cc.log(JSON.stringify(res.json));
            this._config = res.json;

            this.initPlatforms();
        });
    },

    getConfig(key, key2)
    {
        if (!this._config[key]) {
            return null;
        }
        return this._config[key][key2];
    },

    playReward(reward_type)
    {
        let platform = this.getPlatform();
        if (platform) {
            platform.playReward(reward_type);
        }
    },

    playBanner()
    {
        let platform = this.getPlatform();
        if (platform) {
            platform.playBanner();
        }
    },

    closeBanner()
    {
        let platform = this.getPlatform();
        if (platform) {
            platform.closeBanner();
        }
    },

    playInteraction()
    {
        let platform = this.getPlatform();
        if (platform) {
            platform.playInteraction();
        }
    },

    playFeed()
    {
        let platform = this.getPlatform();
        if (platform) {
            platform.playFeed();
        }
    },

    closeFeed()
    {
        let platform = this.getPlatform();
        if (platform) {
            platform.closeFeed();
        }
    },
};

// module.exports.__init__();