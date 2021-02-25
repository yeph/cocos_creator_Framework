/*
 * @Author: jacklove
 * @Date: 2020-08-12 14:37:33
 * @LastEditTime: 2020-08-13 16:43:28
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\helper\guide\RecordMgr.js
 */
module.exports = {

    m_root : null,
    m_recordInfo : [],
    m_current : '',

    startRecord()
    {
        this.createRecordNode();
        this.m_recordInfo = [];
        console.log('startRecord');
    },

    endRecord()
    {
        this.removeRecordNode();
        console.error(JSON.stringify(this.m_recordInfo));
        console.log('endRecord');
    },

    createRecordNode()
    {
        this.m_root = new cc.Node('record_node');
        this.m_root.setContentSize(cc.size(cc.winSize.width*2, cc.winSize.height*2));
        cc.director.getScene().addChild(this.m_root);
        // this.m_root.setPosition(cc.v2(cc.winSize.width/2, cc.winSize.height/2));
        this.m_root.on(cc.Node.EventType.TOUCH_END, this.onTouchEndCallback, this, true);

        // create black mask
        var maskNode = new cc.Node('record_mask');
        let graph = maskNode.addComponent(cc.Graphics);
        graph.fillColor = new cc.Color(255, 255, 255, 255 * 0.6);
        graph.fillRect(0, 0, 1, 1);
        maskNode.setContentSize(cc.size(1, 1));
        this.m_root.addChild(maskNode);
    },

    removeRecordNode()
    {
        if (cc.isValid(this.m_root)) {
            this.m_root.removeFromParent();
        }
    },

    onTouchEndCallback(touch, event)
    {
        let touchLoc = touch.getLocation();
        var touch_node = unit.CocosHelper.findNodeByTouch(touchLoc);
        // console.error(touch_node);
        if (touch_node) {
            var size = touch_node.getContentSize();
            var pos = touch_node.convertToWorldSpaceAR(cc.v2(0, 0));
            var rotation = touch_node.angle;
            var record_mask = this.m_root.getChildByName('record_mask');
            // mask size
            let graph = record_mask.getComponent(cc.Graphics);
            graph.clear();
            graph.fillColor = new cc.Color(255, 255, 255, 255 * 0.6);
            graph.fillRect(-size.width / 2, -size.height / 2, size.width, size.height);

            record_mask.setPosition(pos);
            record_mask.setContentSize(size);
            record_mask.angle = rotation;

            this.m_current = unit.CocosHelper.findNodePath(touch_node);
        }
    },

    // 当前记录
    currentRecord()
    {
        console.error(JSON.stringify(this.m_recordInfo));
    },

    // 记录本次点击
    popRecord()
    {
        if (this.m_current != '') {
            var info = this.m_recordInfo.pop();
            console.error('pop record ' + info);
        }
    },

    // 记录本次点击
    tokenRecord()
    {
        if (this.m_current != '') {
            this.m_recordInfo.push(this.m_current);
            console.error('push record ' + this.m_current);
        }
    },
};