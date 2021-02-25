/*
 * @Author: jacklove
 * @Date: 2019-12-28 16:43:48
 * @LastEditTime : 2019-12-28 16:47:59
 * @LastEditors  : jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\tool\IDCard.js
 */

module.exports = {

    checkID(val) {
        if(this.checkCode(val)) {
            var date = val.substring(6,14);
            if(this.checkDate(date)) {
                if(this.checkProv(val.substring(0,2))) {
                    return true;
                }
            }
        }
        return false;
    },

    
    //省级地址码校验
    checkProv(val) {
        var pattern = /^[1-9][0-9]/;
        var provs = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门"};
        if(pattern.test(val)) {
            if(provs[val]) {
                return true;
            }
        }
        return false;

    },

    //出生日期码校验
    checkDate(val) {
        var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
        if(pattern.test(val)) {
            var year = val.substring(0, 4);
            var month = val.substring(4, 6);
            var date = val.substring(6, 8);
            var date2 = new Date(year+"-"+month+"-"+date);
            if(date2 && date2.getMonth() == (parseInt(month) - 1)) {
                return true;
            }
        }
        return false;
    },

    //校验码校验
    checkCode(val) {
        var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        var code = val.substring(17);
        if(p.test(val)) {
            var sum = 0;
            for(var i=0;i<17;i++) {
                sum += val[i]*factor[i];
            }
            if(parity[sum % 11] == code.toUpperCase()) {
                return true;
            }
        }
        return false;

    },
};