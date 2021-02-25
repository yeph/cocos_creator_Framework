/*
 * @Author: jacklove
 * @Date: 2020-11-09 17:00:14
 * @LastEditTime: 2020-12-15 00:17:37
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\tool\core\ToolBase.js
 */
module.exports = {

    curl_randseed : 0,

    encrypt(dataString, secretkey, nBits = 256)
    {// 封印
        var encryptjs=require('../libs/encryptjs');
        var encrypted = encryptjs.encrypt(dataString, secretkey, nBits);
        return encrypted;
    },

    decrypt(encrypted, secretkey, nBits = 256)
    {// 解印
        var encryptjs=require('../libs/encryptjs');
        var dataString = encryptjs.decrypt(encrypted, secretkey, nBits);
        return dataString;
    },

    createUUID()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },

    autoScale(w1, h1, w2, h2)
    {
        var sc1 = w1 / w2;
        var sc2 = h1 / h2;

        return Math.min(sc1, sc2);
    },

    curl_r2I(min, max)
    {
        return Math.round(this.curl_rand() * (max - min) + min);
    },

    curl_seed(seed)
    {
        this.curl_randseed = seed;
    },

    curl_rand(randseed = null)
    {/* RAND_MAX assumed to be 233279 */
        let _rand_seed = this.curl_randseed;
        if (randseed != null) {
            _rand_seed = randseed;
        }
        this.curl_randseed = ( _rand_seed * 9301 + 49297 ) % 233280;
        return this.curl_randseed / 233280;
    },
};