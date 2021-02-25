/*
 * @Author: jacklove
 * @Date: 2020-12-17 17:57:13
 * @LastEditTime: 2020-12-18 14:06:09
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\advert\platform\MiniBytedance.js
 */
const AdBase = require("./AdBase");
const ADDef = require("../ADDef");
const ADMgr = require("../ADMgr");

class MiniBytedance extends AdBase {

    constructor(plat)
    {
        super(plat);
    };
    
    playReward(reward_type)
    {
        if (!this.isModExist(tt)) { return; }
 
        let cfg = ADMgr.getConfig(this.getPlatform(), 'reward');
        if (!cfg) { return; }

        let videoAd = this._getHandle('videoAd');
        if (videoAd == null) {
            videoAd = tt.createRewardedVideoAd({  adUnitId: cfg.id, });
            videoAd.onClose((res)=>{
                ADMgr.dispatch(ADDef.AD_EVENT.AD_REWARD, {isEnded : res.isEnded, reward_type : reward_type, });
            });

            videoAd.onError((err)=>{
                // console.error('onError', err);
            });

            videoAd.onLoad((err)=>{
                // console.error('onLoad', err);
            });

            // console.log('show 1');
            videoAd.show().then(()=>{
                // console.log('show 1 then');
            }).catch((err)=>{
                // console.log('show 1 catch', err);
            });
            this._setHandle('videoAd', videoAd);          
        }
 
        // h_reward = this._getHandle('reward_video');

        videoAd.load()
        // .show()
        .then(() => {
            // show ad
            console.log('show tt video');
            videoAd.show();
        })
        // err.errMsg
        .catch((err) => {
            // console.error(err);
            if (err.errMsg === 'no advertisement') {
                // err.errMsg = '当前无广告填充，请您稍后再试';
            }
            // this.showToast(err.errMsg);
        });
    };

    playBanner()
    {
        if (!this.isModExist(tt)) { return; }
 
        let cfg = ADMgr.getConfig(this.getPlatform(), 'reward');
        if (!cfg) { return; }

        this.closeBanner();
 
        const bannerAd = tt.createBannerAd({  adUnitId: cfg.id,  style: {  width: 320  }})// 尺寸调整时会触发回调// 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
        bannerAd.onResize(size => {  console.log('Resize后正式宽高:',size.width, size.height);  // 在这里可以根据banner宽高进行定位  
        bannerAd.style.top = cc.winSize.height / 2 - 1 * size.height - 0;  
        bannerAd.style.left = 0;  
        bannerAd.show()
            .then(()=>{    console.log('bannerAd show ok')  })
            .catch((res)=>{    console.log('bannerAd show error',res)  });
        });
 
        bannerAd.onError(res=>{  console.log('bannerAd onError',res)})
        bannerAd.onLoad(res=>{  console.log('bannerAd onLoad',res)})
 
        this._setHandle('bannerAd', bannerAd);  
    };

    closeBanner()
    {
        let bannerAd = this._getHandle('bannerAd');
        	
        if (bannerAd) {
            bannerAd.destroy();
        }
        this._setHandle('bannerAd', null);  
    };

    playInteraction()
    {
        if (!this.isModExist(tt)) { return; }
 
        let cfg = ADMgr.getConfig(this.getPlatform(), 'interaction');
        if (!cfg) { return; }
 
        let InterstitialAd = tt.createInterstitialAd({ adUnitId: cfg.id, });
        InterstitialAd.load()
            .catch((err) => {  console.error('load',err)})        
        InterstitialAd.onLoad(() => {  console.log('onLoad event emit') })
        InterstitialAd.onClose(() => {  console.log('close event emit')})       
        InterstitialAd.onError((e) => {  console.log('error', e)})    /* 建议放在需要展示插屏广告的时机执行 */
        InterstitialAd.show().catch((err) => {  console.error('show',err)})
    };
};

module.exports = MiniBytedance;