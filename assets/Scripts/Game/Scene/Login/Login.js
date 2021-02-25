
/*
 * @Author: jacklove
 * @Date: 2020-07-22 11:35:50
 * @LastEditTime: 2021-01-15 15:47:44
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Scene\Login\Login.js
 */
cc.Class({
    extends: cc.Component,

    properties: {
        lbl_version : cc.Label,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        unit.MemoryDetector.showMemoryStatus();
        cc.debug.setDisplayStats(false);
        this.lbl_version.string = gConfig.CLIENT_VERSION;
        unit.DialogMgr.listen(this.onDialogEvent, this, 0);
    },

    onDialogEvent(data)
    {
        console.warn('onDialogEvent', data.data);
    },

    start () {
        // let jszip = require('jszip');
        cc.resources.load('Config/skill_test', cc.Asset, (err, res) => { 
            console.error(err, res, res._buffer);

            // var arr = [];
            // for (let i = 0; i < res._nativeAsset.length; i++) {
            //     arr.push(res._nativeAsset.charCodeAt(i));
            // }
            
            // var tmpUint8Array = this.stringToUint(res._nativeAsset);

            // let arrayBuffer = new Uint8Array(res._nativeAsset)
            // console.error(tmpUint8Array);
            this.unzip(res._buffer)
            // console.error(res._nativeAsset, tmpUint8Array);
        }); 

        // cc.resources.load({url : 'https://hxsminigames.oss-cn-shanghai.aliyuncs.com/ttgame/skill_test.rar', type : 'binary'}, (err, res) => { 
        //     console.error(err, res);
        //     // console.error(this.str2ab(res));
        //     this.unzip(this.str2ab(res))
        // })

        // cc.assetManager.loadAny({ url: 'Config/skill_test', type: "binary" }, (err, res) => { 
        //     console.error(err, res);
        // })

        // uGS.UDebug.testSkill();

        // console.error('idddd'.search('id'))
    },

    update (dt) {

    },

    onClickTo()
    {
        // unit.SceneMgr.loadingScene('Hall');
        unit.DialogMgr.showDialog(uLg.DlgID.dlg_test);
        console.log("000000000000000")
        unit.DialogMgr.itemNum = 100;
        console.log("222222222222222222222")
    },

    stringToUint(string) {
        var string = btoa(unescape(encodeURIComponent(string))),
            charList = string.split(''),
            uintArray = [];
        for (var i = 0; i < charList.length; i++) {
            uintArray.push(charList[i].charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    },

    str2ab(str) {
        var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
        var bufView = new Uint16Array(buf);
        for (var i=0, strLen=str.length; i<strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    },

    unzip(zipData) {
        let JSZip = require('jszip');

        // var newZip2 = new JSZip();
        // console.error(newZip2);
        // return;
        let newZip = new JSZip(); // 因为将jszip导入为插件，所以可以全局直接访问
        newZip.loadAsync(zipData).then(zip=>{
            console.error(zip);
            zip.file('1_common_attack.json').async('string').then(data=>{
                let json = JSON.parse(data);
                console.error(json);
            });
        });
    },
});
