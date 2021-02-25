/*
 * @Author: jacklove
 * @Date: 2020-01-01 17:16:24
 * @LastEditTime : 2020-01-01 17:21:07
 * @LastEditors  : jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\unit\SpineUnit.js
 */


cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._initSpine();
    },

    start () {
        
    },

    _initSpine()
    {
        if (this.m_spine == null) {
            this.m_spine = this.node.getComponent(sp.Skeleton);
            this.m_spine.setCompleteListener(this.playComplete.bind(this));
            this.m_spine.setStartListener(this.playStart.bind(this));
            this.m_spine.setEndListener(this.playEnd.bind(this));
            this.m_spine.setEventListener(this.playEvent.bind(this));
            this.m_aniEvent = null;

            this.m_timeScale = this.m_spine.timeScale;
            this.m_currentSkin = 'default';
            this.m_mixAni = '';

            this.m_mixList = {};
            // console.error(this.m_spine)
        }
    },
    
    setSkeletonData(data)
    {
        this._initSpine();
        this.m_spine.skeletonData = data;
    },

    setSkeletonDataEx(url, callback)
    {
        this._initSpine();
        cc.sy.ResMgr.replaceSkeletonData(this.m_spine, url, callback);
    },

    getAnimationName()
    {
        this._initSpine();
        return this.m_spine.animation;
    },

    getAnimationInfo(name)
    {
        this._initSpine();
        if (!this.m_spine.skeletonData) {
            return null;
        }
        var spineJson = this.m_spine.skeletonData.skeletonJson;
        // console.error(spineJson);
        return spineJson.animations[name];
        // var animations = this.m_spine._skeleton.data.animations;
        // // console.log(this.m_spine._skeleton);
        // for (let index = 0; index < animations.length; index++) {
        //     const element = animations[index];
        //     if (element.name == name) {
        //         return element;
        //     }
        // }
        // return null;
    },

    _findSkin(name)
    {
        this._initSpine();
        var spineJson = this.m_spine.skeletonData.skeletonJson;
        if (spineJson.skins) {
            return spineJson.skins[name] != null;
        }
        return false;
    },

    getAnimationList()
    {
        this._initSpine();
        var spineJson = this.m_spine.skeletonData.skeletonJson;
        return spineJson.animations;
    },

    play(data)
    {
        var d = new Date();
        // console.log(d.toLocaleString(), data);
        this._initSpine();

        if (data.hasOwnProperty('skin')) {
            if (this._findSkin(data.skin)) {
                this.m_spine.setSkin(data.skin);
                this.m_currentSkin = data.skin;                
            }
            else
            {
                console.warn('Spine skin [', data.skin, '] not find');
            }
        }

        if (data.hasOwnProperty('pos')) {
            this.node.setPosition(cc.v2(data.pos.x, data.pos.y));
        }

        if (data.hasOwnProperty('scale')) {
            this.node.setScale(data.scale);
        }

        if (data.hasOwnProperty('timeScale')) {
            this.m_spine.timeScale = data.timeScale;
        }

        // if (data.hasOwnProperty('trackIndex') && data.hasOwnProperty('name') && data.hasOwnProperty('loop')) {
        //     this.m_spine.setAnimation(data.trackIndex, data.name, data.loop);
        //     this.m_currentAni = data.name;
        // }

        if (data.hasOwnProperty('name')) {
            var trackIndex = 0;
            if (data.hasOwnProperty('trackIndex')) {
                trackIndex = data.trackIndex;
            }

            if (!this.m_spine.isAnimationCached()) {
                this.m_spine.clearTrack(trackIndex);
            }

            var loop = true;
            if (data.hasOwnProperty('loop')) {
                loop = data.loop;
            }

            // console.log(typeof data.name);
            
            if (typeof data.name == 'string') {
                // this.m_spine.setAnimation(trackIndex, data.name, loop);
                this._setAni(trackIndex, data.name, loop);
                // this.m_currentAni = data.name;
            } else {

                // this.m_currentAni = '';
                var index = 0;
                var max_count = Object.keys(data.name).length;

                if (max_count > 0) {
                    max_count--;
                }

                // console.log('max_count', max_count);
                for (const key in data.name) {
                    if (data.name.hasOwnProperty(key)) {
                        const element = data.name[key];
                        // console.error(element, index)
                        if (index != max_count)
                        {
                            this._addAni(trackIndex, element, false);
                        }
                        else if (index == max_count)
                        {
                            this._addAni(trackIndex, element, loop);
                        }
                        index++;
                    }
                }
            }
        }

        // 清理监听
        this.m_aniEvent = null;
        if (data.hasOwnProperty('aniEvent')) {
            this.m_aniEvent = data.aniEvent;
        }
    },

    _findAni(name)
    {
        if (name == '') {
            return false;
        }
        
        if (this.m_spine == null) {
            return false;
        }
        var ani = this.m_spine.findAnimation(name);
        // console.log(name, ani);
        return ani != null;
    },

    _mixAni(from, to, delay)
    {
        if (!this._findAni(from) || !this._findAni(to)) {
            return;
        }

        if (from == to) {
            return;
        }

        var key = from + '_' + to;
        if (this.m_mixList[key]) {
            return;
        }

        this.m_mixList[key] = delay;
        this.m_spine.setMix(from, to, delay);
    },

    _setAni(trackIndex, name, loop)
    {
        this._mixAni(this.m_mixAni, name, 0.1);
        this.m_mixAni = name;
        if (!this.m_spine.isAnimationCached()) {
            this.m_spine.setToSetupPose();
        }
        if (!this._findAni(name)) {
            console.warn('Spine animation [', name, '] not find');
            return;
        }
        this.m_spine.setAnimation(trackIndex, name, loop);
    },

    _addAni(trackIndex, name, loop)
    {
        // console.log(trackIndex, name, loop)
        this._mixAni(this.m_mixAni, name, 0.1);
        this.m_mixAni = name;
        this.m_spine.addAnimation(trackIndex, name, loop);
    },

    // 暂停
    pause()
    {
        this.m_spine.paused = true;
    },

    // 继续
    resume()
    {
        this.m_spine.paused = false;
    },

    playComplete()
    {
        // console.log('playComplete', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'Complete', this.m_spine.animation); }
    },

    playStart()
    {
        // console.log('playStart', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'Start', this.m_spine.animation); }
    },

    playEvent()
    {
        // console.log('playEvent', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'Event', this.m_spine.animation); }
    },

    playEnd()
    {
        // console.log('playEnd', this.m_spine.animation);
        if (this.m_aniEvent) { this.m_aniEvent(this.node, 'End', this.m_spine.animation); }
    },

    // update (dt) {},
});
