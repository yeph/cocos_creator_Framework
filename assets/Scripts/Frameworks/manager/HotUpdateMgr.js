/*
 * @Author: mengjl
 * @Date: 2020-01-02 16:47:41
 * @LastEditTime: 2020-07-24 15:12:38
 * @LastEditors: jacklove
 * @Description: 1 createAssetsManager 2 checkUpdate
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\manager\HotUpdateMgr.js
 */

module.exports = {

    m_assetMgr : null,
    m_checkListener : null,     // 检测回调函数
    m_updateListener : null,    // 更新回调函数
    _updating : false,
    m_update_version : '1.0.0',

    // 设置project.manifest
    setManifestUrl(manifestUrl)
    {
        this.manifestUrl = manifestUrl;
    },

    // 获得本地版本号
    getLocalVer()
    {
        if (this.manifestUrl == null) {
            return this.m_update_version;
        }

        var mani_json = {version : this.m_update_version};
        try {
            mani_json = JSON.parse(this.manifestUrl._nativeAsset);
        } catch (error) {
            
        }
        return mani_json.version;
    },

    // 获得热更新版本号
    getHotUpdateVer()
    {
        return this.m_update_version;
    },

    setCheckListener(listener)
    {
        this.m_checkListener = listener;
    },

    setUpdateListener(listener)
    {
        this.m_updateListener = listener;
    },

    removeUpdataFiles(ups_directory)
    {
        if (!CC_JSB) { return; }

        var _storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + ups_directory);
        if (jsb.fileUtils) jsb.fileUtils.removeDirectory(_storagePath); 
    },

    // 创建AssetsManager
    createAssetsManager(ups_directory, max_task = 5)
    {
        if (!CC_JSB) { return; }
        
        var _storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + ups_directory);
        unit.log('getAssetsManager', 'Storage path for remote asset : ' + _storagePath);
        this.m_assetMgr = new jsb.AssetsManager('', _storagePath, this.versionCompareHandle.bind(this));

        this.m_assetMgr.setVerifyCallback(this.verifyCallback.bind(this));
        this.m_assetMgr.setEventCallback(this.updateCb.bind(this));
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this.m_assetMgr.setMaxConcurrentTask(max_task);
        }
    },

    // 检测更新
    checkUpdate: function () {
        if (this._updating) {
            unit.log('checkUpdate', 'Checking or updating ...');
            return;
        }

        if (!this.m_assetMgr) {
            if (this.m_checkListener) {
                this.m_checkListener(1, 0, false);
            }
            return;
        }

        if (!this.manifestUrl) {
            if (this.m_checkListener) {
                this.m_checkListener(1, 0, false);
            }
            return;
        }

        if (this.m_assetMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this.m_assetMgr.loadLocalManifest(url);
        }
        if (!this.m_assetMgr.getLocalManifest() || !this.m_assetMgr.getLocalManifest().isLoaded()) {
            // this.panel.info.string = 'Failed to load local manifest ...';
            unit.log('checkUpdate', 'Failed to load local manifest ...');
            if (this.m_checkListener) {
                this.m_checkListener(-1);
            }
            return;
        }

        this.m_update_version = this.m_assetMgr.getLocalManifest().getVersion();

        this.m_assetMgr.setEventCallback(this.checkCb.bind(this));
        this.m_assetMgr.checkUpdate();
        this._updating = true;
    },

    // 执行热更新
    hotUpdate()
    {
        this.m_assetMgr.setEventCallback(this.updateCb.bind(this));
        if (this.m_assetMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this.m_assetMgr.loadLocalManifest(url);
        }
        this.m_assetMgr.update();
    },

    versionCompareHandle(versionA, versionB) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    },

    updateCb(event)
    {
        var needRestart = false;
        var failed = false;
        var errcode = -100;
        var _msg = {};

        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.panel.info.string = 'No local manifest file found, hot update skipped.';
                unit.log('updateCb', 'No local manifest file found, hot update skipped.');
                failed = true;
                errcode = -1;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                // var msg = event.getMessage();
                // if (msg) {
                //     // this.panel.info.string = 'Updated file: ' + msg;
                //     // cc.log(event.getPercent()/100 + '% : ' + msg);
                //     unit.log('updateCb', msg);
                // }
                var progress = event.getPercentByFile();
                if(Number.isNaN(progress)){
                    progress = 0;
                }

                _msg.progress = progress;
                errcode = 1;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                unit.log('updateCb', 'Fail to download manifest file, hot update skipped.');
                failed = true;
                errcode = -2;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.panel.info.string = 'Already up to date with the latest remote version.';
                unit.log('updateCb', 'Already up to date with the latest remote version.');
                failed = true;
                errcode = 2;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                // this.panel.info.string = 'Update finished. ' + event.getMessage();
                unit.log('updateCb', 'Update finished. ' + event.getMessage());
                needRestart = true;
                errcode = 0;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                // this.panel.info.string = 'Update failed. ' + event.getMessage();
                // this.panel.retryBtn.active = true;
                unit.log('updateCb', 'Update failed. ' + event.getMessage());
                this._updating = false;
                errcode = -3;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                // this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                unit.log('updateCb', 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                errcode = -4;
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                // this.panel.info.string = event.getMessage();
                unit.log('updateCb', event.getMessage());
                errcode = -5;
                break;
            default:
                break;
        }

        if (failed) {
            this.m_assetMgr.setEventCallback(null);
            this._updating = false;
        }

        if (needRestart) {
            this.m_assetMgr.setEventCallback(null);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this.m_assetMgr.getLocalManifest().getSearchPaths();
            unit.log('newPaths', JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            // cc.audioEngine.stopAll();
            // cc.game.restart();
        }

        _msg.failed = failed;
        _msg.needRestart = needRestart;

        if (this.m_updateListener) {
            this.m_updateListener(errcode, _msg);
        }
    },

    checkCb(event)
    {
        unit.log('checkCb', 'Code: ' + event.getEventCode());

        var failed = false;
        var needUpdate = false;
        var errcode = 0;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.panel.info.string = "No local manifest file found, hot update skipped.";
                unit.log('checkCb', 'No local manifest file found, hot update skipped.');
                failed = true;
                errcode = -2;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                unit.log('checkCb', 'Fail to download manifest file, hot update skipped.');
                failed = true;
                errcode = -3;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.panel.info.string = "Already up to date with the latest remote version.";
                unit.log('checkCb', 'Already up to date with the latest remote version.');
                failed = false;
                needUpdate = false;
                errcode = 1;
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // this.panel.info.string = 'New version found, please try to update.';
                unit.log('checkCb', 'New version found, please try to update.');
                needUpdate = true;
                errcode = 0;
                break;
            default:
                return;
        }
        
        this.m_assetMgr.setEventCallback(null);
        this._updating = false;

        if (this.m_checkListener) {
            this.m_checkListener(errcode, failed, needUpdate);
        }
        // this.m_checkListener = null;

        // if (needUpdate == true) {
        //     this.hotUpdate();
        // }
    },

    // Setup the verification callback, but we don't have md5 check function yet, so only print some message
    // Return true if the verification passed, otherwise return false
    verifyCallback(path, asset)
    {
        // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
        var compressed = asset.compressed;
        // Retrieve the correct md5 value.
        var expectedMD5 = asset.md5;
        // asset.path is relative path and path is absolute.
        var relativePath = asset.path;
        // The size of asset file, but this value could be absent.
        var size = asset.size;
        if (compressed) {
            unit.log('verifyCallback', 'Verification passed : ', relativePath);
            return true;
        }
        else {
            unit.log('verifyCallback', 'Verification passed : ',  + relativePath + ' (' + expectedMD5 + ')');
            return true;
        }
    },

    retry()
    {
        if (!this._updating) {
            this.m_assetMgr.downloadFailedAssets();
        }
    },

    finish() {
        if (this.m_updateListener) {
            if (this.m_assetMgr) {
                this.m_assetMgr.setEventCallback(null);
            }
            this.m_updateListener = null;
        }
    },
};