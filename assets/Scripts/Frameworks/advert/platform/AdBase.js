/*
 * @Author: jacklove
 * @Date: 2020-12-17 17:58:17
 * @LastEditTime: 2020-12-18 13:58:22
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Frameworks\advert\platform\AdBase.js
 */

class AdBase {

    #m_sPlatform = '';
    #_hanlde_list = new Object();

    constructor(plat)
    {
        this.#m_sPlatform = plat;
    };

    getPlatform()
    {
        return this.#m_sPlatform;
    };

    isModExist(mod)
    {
        if(typeof mod == 'undefined' || mod == undefined || mod == null) { return false; }
        return true;
    };

    testFunc(obj, func_name)
    {
        return obj.prototype.hasOwnProperty(func_name);
    };

    _getHandle(key)
    {
        if (this.#_hanlde_list.hasOwnProperty(key)) {
            return this.#_hanlde_list[key];
        }
        return null;
    };

    _setHandle(key, hanlde)
    {
        this.#_hanlde_list[key] = hanlde;
    };

    _removeHandle(key)
    {
        if (this.#_hanlde_list.hasOwnProperty(key)) {
            delete this.#_hanlde_list[key];
        }
    };

    playReward(reward_type)
    {

    };

    playBanner()
    {

    };

    closeBanner()
    {

    };

    playInteraction()
    {

    };

    playFeed()
    {

    };

    closeFeed()
    {

    };
};

module.exports = AdBase;