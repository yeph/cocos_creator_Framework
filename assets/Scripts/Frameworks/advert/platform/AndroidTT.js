/*
 * @Author: jacklove
 * @Date: 2020-12-17 17:56:22
 * @LastEditTime: 2020-12-18 13:56:36
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\advert\platform\AndroidTT.js
 */

const AdBase = require("./AdBase");
// const ADDef = require("../ADDef");
const ADMgr = require("../ADMgr");

class AndroidTT extends AdBase {

    constructor(plat)
    {
        super(plat);
        unit.SDKMgr.listen(unit.SDKEvtDef.SDK_TTAD_REWARD, this.onHandleTTReward, this);
    };

    onHandleTTReward(msg)
    {
        if (msg.key == 'rewardVerify') {
            let reward_type = this._setHandle('reward_type');
            ADMgr.dispatch(ADDef.AD_EVENT.AD_REWARD, {isEnded : true, reward_type : reward_type, });
        }
    };

    _loadTTAD(type, sParams)
    {
        unit.SDKMgr.callTTADMethod('loadVedio', 'V', type, ...sParams);
    };

    _preLoadAD()
    {
        // Interaction
        let cfg = ADMgr.getConfig(this.getPlatform(), 'interaction');
        if (cfg) { this._loadTTAD('interaction', [ cfg.id,3,350,350,640,320,]); }

        // Feed
        let cfg2 = ADMgr.getConfig(this.getPlatform(), 'feed');
        if (cfg2) {  this._loadTTAD('feed', [cfg2.id,1,640,200,]); }
    };
    
    playReward(reward_type)
    {
        let cfg = ADMgr.getConfig(this.getPlatform(), 'reward');
        if (!cfg) { return; }

        let sParams = [
            cfg.id,
            1080, 
            1920,
            'gold',
            0,
            'user_id',
            'ad_id',
        ];

        // unit.SDKMgr.callTTADMethod('loadVedio', 'V', 'reward', sParams.concat(','));
        this._setHandle('reward_type', reward_type);
        this._loadTTAD('reward', sParams);
    };

    playBanner()
    {
        unit.SDKMgr.callTTADMethod('playBannerAd', 'V');
    };

    closeBanner()
    {
        unit.SDKMgr.callTTADMethod('closeBannerAd', 'V');
    };

    playInteraction()
    {
        let cfg = ADMgr.getConfig(this.getPlatform(), 'interaction');
        if (!cfg) { return; }

        unit.SDKMgr.callTTADMethod('playInteractionAd', 'V');
        var GetInteractionSize = unit.SDKMgr.callTTADMethod('GetInteractionSize', 'I');
        // unit.log('playInteraction', GetInteractionSize);
        if (GetInteractionSize <= 1) {
            let sParams = [
                cfg.id,3,350,350,640,320,
            ];
            this._loadTTAD('interaction', sParams);
        }
    };

    playFeed()
    {
        unit.SDKMgr.callTTADMethod('playFeedAd', 'V');
    };

    closeFeed()
    {
        unit.SDKMgr.callTTADMethod('closeFeedAd', 'V');
    };
};

module.exports = AndroidTT;