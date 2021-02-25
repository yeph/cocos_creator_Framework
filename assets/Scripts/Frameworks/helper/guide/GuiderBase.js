/*
 * @Author: jacklove
 * @Date: 2020-01-06 14:11:50
 * @LastEditTime : 2020-01-13 16:16:51
 * @LastEditors  : jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\unit\guide\GuiderBase.js
 */


let GuideHelper = require('GuideHelper')
// let GuiderMgr = require('GuiderMgr')

cc.Class({

    name : 'GuiderBase',

    properties: {
        m_guide_id:
        {
            default: 0,
            tooltip : '引导id',
        },
    },

    onEnter () {
        
    },

    onExit () {

    },

    // 引导ID
    getGuideID()
    {
        return this.m_guide_id;
    },

    setGuideID(guide_id)
    {
        this.m_guide_id = guide_id;
    },

    guideEnd()
    {
        GuideHelper.setGuideEnd(this.m_guide_id);
    },

    // 是否是强制引导
    shouldStart()
    {
        return false;
    },

    tick(dt)
    {

    },
});
