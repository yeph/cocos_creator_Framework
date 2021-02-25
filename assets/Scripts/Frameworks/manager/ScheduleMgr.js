/*
 * @Author: jacklove
 * @Date: 2020-04-15 19:38:34
 * @LastEditTime: 2020-04-15 19:43:13
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\manager\ScheduleMgr.js
 */

module.exports = {

    schedule(component, callback, interval, repeat, delay)
    {
        if (!cc.isValid(component)) {
            return;
        }

        if (!component instanceof cc.Component) {
            console.error('schedule', 'component is not cc.Component');
            return;
        }

        component.schedule(callback, callback, interval, repeat, delay);
    },
}