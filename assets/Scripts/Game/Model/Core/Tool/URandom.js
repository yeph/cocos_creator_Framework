/*
 * @Author: your name
 * @Date: 2021-01-08 14:32:26
 * @LastEditTime: 2021-01-08 14:33:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Tool\URandom.js
 */

module.exports = {

    randseed : 0,

    r2I(min, max)
    {
        return Math.round(this.rand() * (max - min) + min);
    },

    seed(seed)
    {
        this.randseed = seed;
    },

    rand(randseed = null)
    {/* RAND_MAX assumed to be 233279 */
        let _rand_seed = this.randseed;
        if (randseed != null) {
            _rand_seed = randseed;
        }
        this.randseed = ( _rand_seed * 9301 + 49297 ) % 233280;
        return this.randseed / 233280;
    },
    
};