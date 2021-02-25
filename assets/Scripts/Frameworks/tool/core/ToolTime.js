/*
 * @Author: jacklove
 * @Date: 2020-11-09 17:40:52
 * @LastEditTime: 2020-11-09 17:55:01
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\tool\core\ToolTime.js
 */
module.exports = {

    stampToTime(stamp)
    {
        var date = new Date(stamp);    // 时间戳为10位需*1000，时间戳为13位的话不需乘1000

        let d_list = [];
        d_list.push(date.getFullYear());
        d_list.push((date.getMonth() + 1).toString().padStart(2, '0'));
        d_list.push(date.getDate().toString().padStart(2, '0'));

        let t_list = [];
        t_list.push(date.getHours().toString().padStart(2, '0'));
        t_list.push(date.getMinutes().toString().padStart(2, '0'));
        t_list.push(date.getSeconds().toString().padStart(2, '0'));

        return d_list.concat('-') + ' ' + t_list.concat(':');
    },

    timeToString(date, format)
    {
        var _date = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S+': date.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in _date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? _date[k] : ('00' + _date[k]).substr(('' + _date[k]).length));
            }
        }
        return format;
    },

    getTodayStamp(stamp)
    {
        var date = new Date(stamp);
        var _date = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + '00:00:00:000');
        return _date.getTime();
    },

    timeToHMS(delay, tag = 'en') {
        var h = Math.floor(delay / 3600);
        var m = Math.floor((delay - h * 3600) / 60).toString().padStart(2, '0');
        var s = Math.floor((delay - h * 3600 - 60 * m)).toString().padStart(2, '0');
    
        if (tag == 'cn') {
            return h + '时' + m + '分' + s + '秒';
        }
        return h + ':' + m + ':' + s;
    },
};