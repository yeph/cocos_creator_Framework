/*
 * @Author: jacklove
 * @Date: 2020-03-24 10:53:36
 * @LastEditTime: 2020-03-24 11:34:21
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\unit\TouchPolygon.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node,
        },
        collider: {
            default: null,
            type: cc.PolygonCollider
        },
        clickEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && 'i18n:COMPONENT.button.click_events',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._touch_ = false;
        if (this.target == null) {
            this.target = this.node;
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegin, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    start () {

    },

    // update (dt) {},

    onTouchBegin(touch, event)
    {
        var touchLoc = touch.getLocation();
        var loc = this.node.convertToNodeSpaceAR(touchLoc);

        var judge = cc.Intersection.pointInPolygon(loc, this.collider.points);

        // var loc = this.node.convertToNodeSpaceAR(touchLoc);
        // console.error(touchLoc, this.collider.points, judge);
        if (judge) {
            this._touch_ = true;
            this.target.scale = 1.2;
        }
    },

    onTouchEnd(touch, event)
    {
        if (this._touch_) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event, this.node);
        }
        this._touch_ = false;
        this.target.scale = 1.0;
    },

    onTouchCancel(touch, event)
    {
        this._touch_ = false;
        this.target.scale = 1.0;
    },
});
