/*
 * @Author: jacklove
 * @Date: 2020-11-09 17:52:43
 * @LastEditTime: 2020-11-09 18:00:32
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\tool\core\ToolNumber.js
 */
module.exports = {

    r2I(min, max)
    {
        return Math.round(Math.random() * (max - min) + min);
    },

    numFixed(num, decimal) 
    {
        if (num == undefined || num == null) {
            return '0';
        }

        return parseFloat(num.toString()).toFixed(decimal);
    },
};