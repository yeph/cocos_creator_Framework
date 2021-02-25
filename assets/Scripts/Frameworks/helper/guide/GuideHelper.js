/*
 * @Author: jacklove
 * @Date: 2020-01-13 15:36:55
 * @LastEditTime: 2020-11-09 18:21:48
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\helper\guide\GuideHelper.js
 */

module.exports = {
    m_finishList : new Array(),
    m_guideList : new Array(),
    m_guide : null,
    m_thread : null,
    m_uniqueID : '',

    m_nodeIdList : new Array(),

    setUniqueID(uniqueID)
    {
        this.m_uniqueID = uniqueID;
    },

    setFinishList(guide_list)
    {
        this.m_finishList = guide_list;
    },

    getFinishList()
    {
        return this.m_finishList;
    },

    readGuide()
    {
        var key = 'guide_finish_' + this.m_uniqueID;
        var _data_ = unit.DataMgr.getItem(key);
        if (_data_) {
            this.m_finishList = JSON.parse(_data_);
        } 
    },

    writeGuide()
    {
        var key = 'guide_finish_' + this.m_uniqueID;
        unit.DataMgr.setItem(key, JSON.stringify(this.m_finishList)); 
    },

    pushGuide(clsName, guideId)
    {
        var obj = new clsName();
        obj.setGuideID(guideId);
        this.m_guideList.push(obj);
    },

    isGuideFinish(guideId)
    {
        for (let index = 0; index < this.m_finishList.length; index++) {
            const guide_id = this.m_finishList[index];
            if (guideId == guide_id) {
                return true;
            }
        }
        return false;
    },

    isGuiding()
    {
        return this.m_guide != null;
    },

    getGuide(guideId)
    {
        for (let index = 0; index < this.m_guideList.length; index++) {
            const guide = this.m_guideList[index];
            if (guide.getGuideID() == guideId) {
                return guide;
            }
        }
        return null;
    },

    tick (dt) {
        if (dt > 1.0) {
            dt = 0.03;
        }

        if (this.m_guide) {
            this.m_guide.tick(dt);
        }
    },

    // 执行引导
    execGuide()
    {
        var guideId = -1;
        for (let index = 0; index < this.m_guideList.length; index++) {
            const guide = this.m_guideList[index];
            // console.log(guide);
            guideId = guide.getGuideID();
            if (this.isGuideFinish(guideId) == false && guide.shouldStart()) {
                this.runGuide(guide);
                return;
            }
        }
    },

    // 触发引导
    trigGuide(guideId, param)
    {
        if (this.isGuiding()) {
            return;
        }
        var guide = this.getGuide(guideId);
        if (guide && this.isGuideFinish(guide.getGuideID()) == false) {
            this.runGuide(guide, param);
        }
    },

    setGuideEnd(guideId)
    {
        this.m_finishList.push(guideId);
        this.m_finishList.sort(function(a,b){
			return a - b;
		})
        this.m_guide = null;
    },

    runGuide(guide, param = {})
    {
        guide.onEnter(param);
        this.m_guide = guide;
    },

    event(event_name)
    {
        // console.log('event', event_name);
        if (this.m_guide && this.m_thread) {
            this.m_thread.event(event_name);
        }
    },

    createThread()
    {
        // 创建协程
        this.m_thread = unit.ThreadMgr.create('GuiderThread');
        return this.m_thread;
    },

    stopThread()
    {
        // 创建协程
        unit.ThreadMgr.removeByName('GuiderThread');
        this.m_thread = null;
    },
    
    startGuide()
    {
        this.m_guide = null;
        this.execGuide();
    },

    setNodeID(node, id)
    {
        // console.error(id);
        if (id == 0) {
            return;
        }
        if (this.m_nodeIdList.indexOf(id) != -1) {
            console.error('node id is already exist ', id);
            return;
        }
        this.m_nodeIdList.push(id);
        node.setId(id);
    },

};