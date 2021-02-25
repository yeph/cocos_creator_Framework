/*
 * @Author: jacklove
 * @Date: 2020-03-18 14:22:12
 * @LastEditTime: 2020-11-09 17:32:02
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\manager\DataMgr.js
 */
module.exports = {

    _cache_ : {},

    _word_:[],


    // 放入缓存数据
    setCache(key, value)
    {
        this._cache_[key] = value;
    },

    
    // 取出缓存数据
    getCache(key, value)
    {
        if (this._cache_.hasOwnProperty(key)) {
            return this._cache_[key];
        }
        return value;
    },

    // 删除缓存
    deleteCache(key)
    {
        delete this._cache_[key];
    },

    // 清理所有缓存
    clearCache()
    {
        delete this._cache_;
        this._cache_ = {};
    },

    logCache()
    {
        // unit.log('logCache', this._cache_);
    },

    setItem(key, value)
    {
        cc.sys.localStorage.setItem(key, value);
    },

    getItem(key, value)
    {
        var val = cc.sys.localStorage.getItem(key);
        if (val == null || val == undefined || val == 'undefined') {
            return value;
        }
        return val;
    },

    removeItem(key)
    {
        cc.sys.localStorage.removeItem(key);
    },

    encrypt(dataString, secretkey, nBits = 256)
    {// 封印
        var encryptjs=require('encryptjs');
        var encrypted = encryptjs.encrypt(dataString, secretkey, nBits);
        return encrypted;
    },

    decrypt(encrypted, secretkey, nBits = 256)
    {// 解印
        var encryptjs=require('encryptjs');
        var dataString = encryptjs.decrypt(encrypted, secretkey, nBits);
        return dataString;
    },

    // 存入指定键值的数据结构中
    setUnique(unique_key, key, value, secretkey = null)
    {
        var unique_data = {};
        var unique_data_str = this.getItem(unique_key);
        if (unique_data_str != null) {
            if (secretkey) {// jia mi
                try {
                    unique_data_str = this.decrypt(unique_data_str, secretkey);
                } catch (err) {
                    // console.error(err);
                }
            }

            try {
                unique_data = JSON.parse(unique_data_str);
            } catch (err) {
                // console.error(err);
            }
        }

        unique_data[key] = value;

        let save_data_str = JSON.stringify(unique_data);
        if (secretkey) {// jia mi
            save_data_str = this.encrypt(save_data_str, secretkey);
        }

        this.setItem(unique_key, save_data_str);
    },

    // 取出指定键值的数据结构中
    getUnique(unique_key, key, value, secretkey = null)
    {
        var unique_data_str = this.getItem(unique_key);
        if (unique_data_str == null) {
            return value;
        }

        if (secretkey) {// jie mi
            try {
                unique_data_str = this.decrypt(unique_data_str, secretkey);
            } catch (err) {
                // console.error(err);
            }
        }

        let unique_data = {};
        try {
            unique_data = JSON.parse(unique_data_str);
        } catch (err) {
            
        }

        if (unique_data.hasOwnProperty(key)) {
            return unique_data[key];
        }

        return value;
    },

    output(datas, file_name)
    {
        if (cc.sys.isBrowser) {
            this._saveByBrowser(datas, file_name);
        } else {
            
        }
    },

    _saveByBrowser(datas, file_name)
    {
        datas = JSON.stringify(datas);
        var textFileAsBlob = new Blob([datas], { type: 'application/json' });
        var downloadLink = document.createElement("a");
        downloadLink.download = file_name;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null) {
            // Chrome允许点击链接
            //而无需实际将其添加到DOM中。
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            //在点击之前 Firefox要求将链接添加到DOM中
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    },
};