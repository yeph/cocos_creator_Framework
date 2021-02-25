/*
 * @Author: jacklove
 * @Date: 2019-12-11 11:05:13
 * @LastEditTime: 2020-11-17 13:30:37
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\net\IHttp.js
 */

module.exports = {

    m_isLog : 0,

    isLog(isLog)
    {
        this.m_isLog = isLog;
    },

    request(method, url, params = null, timeout = 5000, headers = null, callback = null)
    {
        if (this.m_isLog > 0) {
            console.warn('url', url, 'params', params);
        }
        // 
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            // unit.log('onreadystatechange', 'xhr.readyState=', xhr.readyState, ' xhr.status=', xhr.status);
            if (xhr.readyState === 4){

                if(xhr.status >= 200 && xhr.status < 300) {
                    var respone = xhr.responseText;
                    try {
                        var resJson = JSON.parse(respone);
                        if (callback) {callback(resJson);}
                    } catch (e) {
                        unit.error(e);
                    }
                }else{
                    if (callback) {callback(null);}
                }
            }
        };
        xhr.open(method, url, true);

        xhr.ontimeout = function (ev) {
            cc.log(ev);
            if (callback) {callback(null);}
        }

        if (headers) {
            for (const key in headers) {
                const value = headers[key];
                // console.log(key, value);
                xhr.setRequestHeader(key, value);
            }
        }

        if (cc.sys.isNative) {
            xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate');
        }

        xhr.timeout = timeout; // 5 seconds for timeout
        xhr.send(params);
    },
    
    get(url, callback = null, timeout = 5000, headers = null)
    {
        this.request('GET', url, null, timeout, headers, callback);
    },

    post(url, params = null, callback = null, timeout = 5000, headers = null)
    {
        this.request('POST', url, params, timeout, headers, callback);
    },
};