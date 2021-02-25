/*
 * @Author: jacklove
 * @Date: 2020-10-14 13:59:04
 * @LastEditTime: 2020-11-09 18:22:33
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\net\scut\ISuct.js
 */
module.exports = {

    parseJson(data){
		return JSON.parse(data);
    },
    
    serializeJson(json) {
		return JSON.stringify(json);
    },
    
    extend(parent, child) {
		var target = child || {};
		var src = parent || {};
		var name, val;
		for (name in src) {
			val = src[name];

			if ( target === val ) {
				continue;
			} else if ( val !== undefined ) {
				target[ name ] = val;
			}
		}
		return target;
    },
    
    md5: function(str) {
		return uTool.md5(str);
	},
	/**
	 * url encode.
	 * @param {Object} param
	 * @returns {String}
	 */
	urlEncode: function(param) {
		var params = param || {};
		var name, val, result;
		for (name in params) {
			val = params[name];
			if(typeof val !== "object" && typeof val !== "function"){
				if(result !== undefined) result = result + '&';
				else result ='';				
				result = result + name + '=' + val;
			}
		}
		return result;
	},
	/**
	 * build request pack.
	 * @param {Object} param
	 * @param {String} key
	 * @returns {String}
	 */
	buildPack: function(param, key) {
		var paramStr = '?d=' + this.sign(this.urlEncode(param), key);
		// cc.log('param='+paramStr);
		return paramStr;
	},
	/**
	 * Request param sign.
	 * @param {String} str
	 * @param {String} key
	 * @returns {String}
	 */
	sign: function(str, key) {
		var signKey = str + (key ||'');
		var md5Str = this.md5(signKey);
		/*cc.log('signKey='+signKey+', md5='+md5Str);
		 */
		var result = str + '&sign=' + md5Str;
		if(encodeURIComponent) result = encodeURIComponent(result);
		return result;
    },
    
    transData(data, signKey = '')
    {
        var jsonStr;
        if(typeof data === 'object' ){
            jsonStr = this.buildPack(data, signKey);
        } else{
            jsonStr = data || '';
        }
        return jsonStr;
	},
	
	createReader: function(jsonData) {
		var _data = jsonData || {};
		return {
			getSuccess: function(){
				return _data.ErrorCode === 0 || false;
			},
			getAction: function(){
				return _data.ActionId || 0;
			},
			getData: function(){
				return _data.Data;
			}
		};
	},
};