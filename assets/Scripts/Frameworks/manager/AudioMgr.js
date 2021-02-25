/*
 * @Description: In User Settings Edit
 * @Author: jacklove
 * @Date: 2019-07-11 17:12:12
 * @LastEditors: zhaozhifei
 * @LastEditTime: 2020-06-05 15:31:17
 */

module.exports = {
    effect_switch : true,
    music_switch : true,
    music_id : -1,
    _audioPath : 'sounds',
    _bg_vloume : 0, // fix bug

    // use this for initialization
    __init__:function () {
        cc.game.on(cc.game.EVENT_HIDE, ()=>{
            // cc.audioEngine.pauseAll();
            cc.audioEngine.setMusicVolume(0);
        });
        cc.game.on(cc.game.EVENT_SHOW, ()=>{
            // cc.audioEngine.resumeAll();
            if (this.music_switch) {
                cc.audioEngine.setMusicVolume(this._bg_vloume);
            }
        });
    },
    
    getUrl:function(url){
        return this._audioPath + '/' + url;
    },

    setAudioPath(path) {
        this._audioPath = path;
    },

    playMusic(url, vloume = 1, loop = true)
    {
        var audioUrl = this.getUrl(url);
        // let ResMgr = require("ResMgr");

        this._bg_vloume = vloume;
        var _vloume = 0;
        if (this.music_switch) {
            _vloume = vloume;
        }

        unit.ResMgr.loadAsset(audioUrl, cc.AudioClip, (audioClip)=>{
            this.music_id = cc.audioEngine.playMusic(audioClip, loop);
            cc.audioEngine.setMusicVolume(_vloume);
        });
    },

    playEffect(url, vloume = 1, loop = false, callback = null)
    {
        if (this.effect_switch == false) {
            return;
        }
        
        var audioUrl = this.getUrl(url);
        // let ResMgr = require("ResMgr");

        unit.ResMgr.loadAsset(audioUrl, cc.AudioClip, (audioClip)=>{
            var audio_id = cc.audioEngine.play(audioClip, loop, vloume);
            if (callback) {
                callback(audio_id);
            }
        });
    },


    playBGM(url, vloume, loop) 
    {
        this.playMusic(url, vloume, loop);
    },
    
    playSFX(url, vloume, loop, callback) 
    {
        this.playEffect(url, vloume, loop, callback);
    },

    stop(audio_id)
    {
        cc.audioEngine.stop(audio_id);
    },

    setMusicSwitch(off)
    {
        if (off) {
            this.music_switch = off;
        }
        else
        {
            this.music_switch = !this.music_switch;
        }
        
        if(this.music_switch){
            cc.audioEngine.resume(this.music_id);
            cc.audioEngine.setMusicVolume(this._bg_vloume);
        }
        else{
            cc.audioEngine.pause(this.music_id);
            cc.audioEngine.setMusicVolume(0);
        }
    },

    setEffectSwitch(off)
    {
        if (off) {
            this.effect_switch = off;
        }
        else
        {
            this.effect_switch = !this.effect_switch;
        }
    },

    getMusicSwitch()
    {
        return this.music_switch;
    },

    getEffectSwitch()
    {
        return this.effect_switch;
    },
    
    pauseAll() {
        cc.audioEngine.pauseAll();
    },
    
    resumeAll() {
        cc.audioEngine.resumeAll();
    },

};

module.exports.__init__();
