/*
 * @Author: jacklove
 * @Date: 2020-12-18 09:48:02
 * @LastEditTime: 2020-12-18 13:56:21
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\advert\platform\MiniVivo.js
 */
const AdBase = require("./AdBase");
// const ADDef = require("../ADDef");
const ADMgr = require("../ADMgr");

class MiniVivo extends AdBase {

    constructor(plat)
    {
        super(plat);
        // this._playReward();
    };

    playReward()
    {
        if (!this.isModExist(qg)) { return; }
        let rewardedAd = this._getHandle('videoAd');
        if (rewardedAd) {
            rewardedAd.load();
            // let isLoadVideoAd = this._getHandle('isLoadVideoAd');
            // if (isLoadVideoAd == true) {
            //     rewardedAd.show().then(()=>{ 
            //         console.log('激励视频广告展示完成');
            //     }).catch((err)=>{
            //         console.log('激励视频广告展示失败', JSON.stringify(err));
            //         this._setHandle('isLoadVideoAd', false); 
            //     }) 
            // }
            // else
            // {
            //     rewardedAd.load();
            // }
            
        }
        else
        {
            this._playReward();
        }
        // console.error('playReward', rewardedAd);
    };

    _playReward(reward_type)
    {
        if (!this.isModExist(qg)) { return; }
 
        let cfg = ADMgr.getConfig(this.getPlatform(), 'reward');
        console.error('_playReward', this.getPlatform(), cfg);
        if (!cfg) { return; }

        let rewardedAd = this._getHandle('videoAd');


        if (rewardedAd == null) {
            rewardedAd = qg.createRewardedVideoAd({ posId : cfg.id, });
            rewardedAd.onError(err => {
                console.log("激励视频广告加载失败", err);
            });
            rewardedAd.onLoad((res)=>{
                this._setHandle('isLoadVideoAd', true);
                console.log('激励视频广告加载完成-onload触发', JSON.stringify(res));
                rewardedAd.show().then(()=>{ 
                    console.log('激励视频广告展示完成');
                }).catch((err)=>{
                    console.log('激励视频广告展示失败', JSON.stringify(err));
                    // this._setHandle('isLoadVideoAd', false); 
                }) 
            })
            const func = (res)=>{
                console.log('视频广告关闭回调')
                if (res && res.isEnded) {
                    console.log("正常播放结束，可以下发游戏奖励");
                } else {
                    console.log("播放中途退出，不下发游戏奖励");
                }
                ADMgr.dispatch(ADDef.AD_EVENT.AD_REWARD, {isEnded : res.isEnded, reward_type : reward_type, });
            }
            rewardedAd.onClose(func);   
            
            this._setHandle('videoAd', rewardedAd); 

            // this._setHandle('isLoadVideoAd', true); 
        }
    };

    playBanner()
    {

        if (!this.isModExist(qg)) { return; }
 
        let cfg = ADMgr.getConfig(this.getPlatform(), 'banner');
        if (!cfg) { return; }

        this.closeBanner();

        const bannerAd = qg.createBannerAd({ posId : cfg.id, });

        bannerAd.onError(err => {
            console.log("banner广告加载失败", err);
        });
        
        bannerAd.show().then(()=>{ 
            console.log('banner广告展示完成');
        }).catch((err)=>{
            console.log('banner广告展示失败', JSON.stringify(err));
        })
 
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
        if (!this.isModExist(qg)) { return; }
 
        let cfg = ADMgr.getConfig(this.getPlatform(), 'interaction');
        if (!cfg) { return; }
 
        const interstitialAd = qg.createInterstitialAd({ posId : cfg.id, });
        interstitialAd.onError(err => {
            console.log("插屏广告加载失败", err);
        });
    
        interstitialAd.show().then(()=>{ 
            console.log('插屏广告展示完成');
            }).catch((err)=>{
            console.log('插屏广告展示失败', JSON.stringify(err));
        });
    };
};

module.exports = MiniVivo;