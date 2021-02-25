/*
 * @Author: jacklove
 * @Date: 2020-07-22 09:35:30
 * @LastEditTime: 2021-01-13 14:27:26
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Scene\Begin\Begin.js
 */ 

cc.Class({
    extends: cc.Component,

    properties: {
        pb_loading:
        {
            default: null,
            type : cc.ProgressBar,
            tooltip : '进度条',
        },

        lbl_desc:
        {
            default: null,
            type : cc.Label,
            tooltip : '进度',
        },

        manifestUrl: {
            type: cc.Asset,     // use 'type:' to define Asset object directly
            default: null,      // object's default value is null
        },
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        unit.init();
        uGS.init();
        unit.MVMgr.debugger(true);
        unit.MemoryDetector.showMemoryStatus();

        this.pb_loading.node.active = false;
        this.lbl_desc.string = '';
        globalData.safeSize = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
        if(cc.sys.isNative){
            let safeArea = cc.sys.getSafeAreaRect();
            console.log("安全区域",safeArea)
            globalData.safeSize.top = cc.winSize.height - safeArea.height - safeArea.y;
            globalData.safeSize.bottom = safeArea.y;
            globalData.safeSize.left = safeArea.x;
            globalData.safeSize.right = cc.winSize.width - safeArea.width - safeArea.x;
            globalData.safeSize.width = safeArea.width;
            globalData.safeSize.height = safeArea.height;
        }
    },

    start () {
        // if (!cc.sys.isNative) 
        {
            this.exeHotUp();
            return;
        }

        unit.HotUpdateMgr.setManifestUrl(this.manifestUrl);
        unit.error('getLocalVer', unit.HotUpdateMgr.getLocalVer());

        unit.HotUpExMgr.checkEngine(gConfig.versionInfoUrl, (data)=>{
            unit.log('updateInfo', JSON.stringify(data));
            if (data.engine_update > 0) {
                // unit.DialogMgr.showDialog(uLogic.DialogID.dialog_alert, {text : '有新版本需要更新，确认跳转吗？', callback : (result)=>{
                //     cc.sys.openURL(data.download_url);
                //     unit.HotUpdateMgr.removeUpdataFiles('ups-assert');
                //     cc.game.end();
                // }});
                cc.sys.openURL(data.download_url);
                unit.HotUpdateMgr.removeUpdataFiles('ups-assert');
                // cc.game.end();
                return;   
            }
            
            this.exeHotUp();
        });
    },

    onDestroy(){
        unit.HotUpdateMgr.finish();
    },

    // update (dt) {},
    exeHotUp()
    {
        this.lbl_desc.string = '正在检测更新...';
        // 绑定回调函数
        unit.HotUpdateMgr.setCheckListener(this.onCheck.bind(this));    
        unit.HotUpdateMgr.setUpdateListener(this.onUpdate.bind(this));
        
        unit.HotUpdateMgr.createAssetsManager('ups-assert');
        unit.HotUpdateMgr.checkUpdate();

        gConfig.CLIENT_VERSION = unit.HotUpdateMgr.getLocalVer();
    },

    gotoLogin()
    {
        unit.SceneMgr.loadingScene('Login');
    },

    onCheck(errcode, failed, needUpdate)
    {
        unit.log('onCheck', errcode, failed, needUpdate);
        if (errcode == 0) {
            unit.HotUpdateMgr.hotUpdate();
        }
        else if (errcode == 1) {
            this.gotoLogin();
        }
        else if (errcode == -3) {
            this.gotoLogin();
        }
        else {
            this.gotoLogin();
        }
    },

    onUpdate(errcode, msg)
    {
        unit.log('onUpdate', errcode, JSON.stringify(msg));
        if (errcode == 0) {
            cc.game.restart();
        }
        else if (errcode == 1) {
            this.pb_loading.node.active = true;
            this.pb_loading.progress = (msg.progress);
            this.lbl_desc.string = '更新进度 ' + parseInt(msg.progress * 100) + '%';
        }
        else if (errcode == 2) {
            this.gotoLogin();
        }
    },
});
