/*
 * @Author: jacklove
 * @Date: 2019-12-26 12:48:52
 * @LastEditTime: 2020-11-09 18:22:23
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\manager\LogMgr.js
 */

module.exports = {

    m_readBuffer : '',
    m_fullPath : '/storage/emulated/0/',
    m_fileName : 'UnitGame',
    m_logPath : '',
    m_print : true,     

    log(tag, ...subst)
    {
        this._writeLog('log', tag, ...subst);
    },

    warn(tag, ...subst)
    {
        this._writeLog('warn', tag, ...subst);
    },

    error(tag, ...subst)
    {
        this._writeLog('error', tag, ...subst);
    },

    setPrint(isPrint)
    {
        this.m_print = isPrint;
    },

    setFileName()
    {

    },

    _writeLog(type, tag, ...subst)
    {
        // console.error('_writeLog', this.m_print);
        if (!this.m_print) {
            return;
        }

        if (type == 'log') {
            console.log(tag, ...subst);
        } 
        else if (type == 'warn') {
            console.warn(tag, ...subst);
        }
        else if (type == 'error') {
            console.error(tag, ...subst);
        }

        // console.error('_writeLog 2', cc.sys.isNative, cc.sys.os, cc.sys.OS_ANDROID);
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            this._writeToFile(type, tag, ...subst);
        }
    },

    _creatFile()
    {
        if (this.m_logPath != '') {
            return;
        }

        var day_str = uTool.timeToString(new Date(), 'yyyyMMdd');
        var dir_path = this.m_fullPath + this.m_fileName + '/' + day_str + '/';

        if(!jsb.fileUtils.isDirectoryExist(dir_path)) {
            jsb.fileUtils.createDirectory(dir_path);
        }
        else {
            console.error('dir is exist!!!', dir_path);
        }

        var fileName = 'log_' + uTool.timeToString(new Date(), 'yyyyMMddhhmmss') + '.txt';
        this.m_logPath = dir_path + fileName;
    },

    _writeToFile(type, tag, ...subst)
    {
        // console.error('_writeToFile', type, CC_JSB);
        if (!CC_JSB) { return; }
        
        this._creatFile();

        if (tag == null) { tag = ''; }
        var sTag = JSON.stringify(tag);
        var sMsg = this._getParamString(...subst);
        var sTime = uTool.timeToString(new Date(), 'yy-MM-dd hh:mm:ss');

        this.m_readBuffer += '[';
        this.m_readBuffer += sTime;
        this.m_readBuffer += ']';
        this.m_readBuffer += '[';
        this.m_readBuffer += type;
        this.m_readBuffer += '] ';
        this.m_readBuffer += sTag;
        this.m_readBuffer += ':';
        this.m_readBuffer += sMsg;
        this.m_readBuffer += '\n';

        if (this.m_logPath != '') {
            // console.error('writeStringToFile', this.m_logPath, this.m_readBuffer);
            jsb.fileUtils.writeStringToFile(this.m_readBuffer, this.m_logPath);
        }
    },

    _getParamString(...param)
    {
        var paramStr = '';
        for (let index = 0; index < param.length; index++) {
            const element = param[index];
            paramStr += JSON.stringify(element);
        }
        return paramStr;
    },
    
    _stack() {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({[lineBreak[0]]: lineBreak[1]});
            }
        });

        // return result;
    
        var list = [];

        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    list.push(key);
                }
            }
        }

        // return list;
        return list.toString();
    },
};