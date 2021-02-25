/*
 * @Author: jacklove
 * @Date: 2019-11-25 11:17:59
 * @LastEditTime: 2020-12-01 09:32:41
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\net\IWebSocket.js
 */

cc.Class({
    // extends: cc.Component,

    name : 'IWebSocket',

    properties: {
        m_url :
        {
            default : '',
            tooltip : 'url',
        },
        m_websocket :
        {
            default : null,
            tooltip : 'WebSocket',
        },
    },

    setUrl(url)
    {
        this.m_url = url;
    },

    getUrl()
    {
        return this.m_url;
    },
    
    connect(onopen, onmessage, onerror, onclose)
    {
        // console.error('connect')
        this.m_funcList = new Array();
        this.close();
        this.m_websocket = new WebSocket(this.m_url);
        this.m_websocket.onopen = this.onOpen.bind(this);
        this.m_websocket.onmessage = this.onMessage.bind(this);
        this.m_websocket.onerror = this.onError.bind(this);
        this.m_websocket.onclose = this.onClose.bind(this);

        this.m_funcList[0] = onopen;
        this.m_funcList[1] = onmessage;
        this.m_funcList[2] = onerror;
        this.m_funcList[3] = onclose;

        // this.m_websocket.binaryType = 'arraybuffer';
    },

    isConnect()
    {
        if (this.m_websocket == null) { return false; }
        return this.m_websocket.readyState == WebSocket.OPEN;
    },

    binaryType(type)
    {
        if (!this.m_websocket) {
            return;
        }
        this.m_websocket.binaryType = type;
    },

    onOpen(evt)
    {
        if (this.m_funcList[0]) { this.m_funcList[0](evt); }
    },

    onMessage(evt)
    {
        if (this.m_funcList[1]) { this.m_funcList[1](evt); }
    },

    onError(evt)
    {
        if (this.m_funcList[2]) { this.m_funcList[2](evt); }
    },

    onClose(evt)
    {
        if (this.m_funcList[3]) { this.m_funcList[3](evt); }
    },

    close()
    {
        if (this.m_websocket == null) { return; }
        if (this.m_websocket.readyState == WebSocket.CLOSED || this.m_websocket.readyState == WebSocket.CLOSING) { return; }
        this.m_websocket.close();
    },
    
    send(data) {
        if (this.m_websocket == null) { return; }
        if (this.m_websocket.readyState != WebSocket.OPEN) { return; }
        this.m_websocket.send(data);
    },
    
});
