/*
 * @Author: jacklove
 * @Date: 2020-07-30 12:18:02
 * @LastEditTime: 2020-07-31 17:37:24
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\mvc\view\MVLabel.js
 */ 

let MVBase = require('./MVBase');
// const { isArray } = require('util');

cc.Class({
    extends: MVBase,

    name : 'MVLabel',

    properties: {

        templateMode :
        {
            default: true,
            tooltip : '是否使用模板',
        },

        templateText :
        {
            default: '{{0}}',
            tooltip : '模板文字',
        },

        cacheValueArr :
        {
            default: [],
            type : [cc.String],
            tooltip : '缓存值列表',
            visible : false,
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
    init(...params)
    {
        this.cacheValueArr = this.getValueArr(this.templateText);
        this.setValueString(this.getReplaceText(this.cacheValueArr));
        console.error(this.cacheValueArr);
    },

    handleData(data)
    {
        var needChange = false;
        for (let i = 0; i < this.watchPathArr.length; i++) {
            const watchPath = this.watchPathArr[i];
            var cData = unit.MVMgr.findData(data, watchPath);
            // console.error(watchPath, cData);
            if (cData && this.cacheValueArr[i]) {
                this.cacheValueArr[i] = cData;
                needChange = true;
            }
        }
        if (needChange) {
            if (this.templateMode == false) {
                this.setValueString(JSON.stringify(data));
                return;
            }
            this.setValueString(this.getReplaceText(this.cacheValueArr));
        }       
    },

    getValueArr(sText)
    {
        // console.error(sText);
        let regexAll = /\{\{(.+?)\}\}/g; //匹配： 所有的{{value}}
        let regex = /\{\{(.+?)\}\}/;//匹配： {{value}} 中的 value
        let res = sText.match(regexAll);//匹配结果数组 [{{value}}，{{value}}，{{value}}]
        if (res == null) return [];//未匹配到文本
        let str = sText;//原始字符串模板 "name:{{0}} 或 name:{{0:fix2}}"

        // console.error(res);

        var arr_result = [];
        for (let i = 0; i < res.length; i++) {
            let e = res[i];
            let arr = e.match(regex);
            // console.error('arr', arr);
            let format = arr[1];
            if (format == null) { format = 'null'; }
            arr_result.push(format);
        }
        return arr_result;
    },

    getReplaceText(formatArr) {
        if(!this.templateText) { return ''; }
        let regexAll = /\{\{(.+?)\}\}/g; //匹配： 所有的{{value}}
        let regex = /\{\{(.+?)\}\}/;//匹配： {{value}} 中的 value
        let res = this.templateText.match(regexAll);//匹配结果数组 [{{value}}，{{value}}，{{value}}]
        if (res == null) return '';//未匹配到文本
        let str = this.templateText;//原始字符串模板 "name:{{0}} 或 name:{{0:fix2}}"

        for (let i = 0; i < res.length; i++) {
            let e = res[i];
            let arr = e.match(regex);
            let format = formatArr[i];
            if (format == null) { format = arr[1]; }
            str = str.replace(e, format);
        }
        return str;
    },

    setValueString(str)
    {
        if (!cc.isValid(this.bindNode)) { return; }
        if (this.bindNode.getComponent(cc.Label)) { this.bindNode.getComponent(cc.Label).string = str; }
        if (this.bindNode.getComponent(cc.RichText)) { this.bindNode.getComponent(cc.RichText).string = str; }
    },
});
