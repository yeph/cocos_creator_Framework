/*
 * @Author: jacklove
 * @Date: 2019-12-17 13:24:26
 * @LastEditTime: 2021-01-04 11:09:35
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Scene\Loading\Loading.js
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

        lbl_num:
        {
            default: null,
            type : cc.Label,
            tooltip : '进度',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.pb_loading.progress = 0;
        this.lbl_num.string = '加载进度 0 %';
        unit.ResMgr.releaseZero();
        unit.MemoryDetector.showMemoryStatus();
    },

    start () {

        var scene_name = unit.SceneMgr.getLoadData();
        unit.LoadMgr.clearQueue();

        unit.LoadMgr.startLoad(scene_name, 
            ()=>{
                unit.SceneMgr.loadScene(scene_name);
                // setTimeout(() => {
                //     unit.SceneMgr.loadScene(scene_name);
                // }, 3000);
            },
            (progress)=>{
                // unit.log('loading progress ', progress);
                this.pb_loading.progress = progress;
                this.lbl_num.string = '加载进度 ' + (progress * 100).toFixed(0) + ' %';
            }, 
            'frame');
    },

    onDestroy()
    {
        unit.LoadMgr.stopLoading();
    },

    // update (dt) {},

});
