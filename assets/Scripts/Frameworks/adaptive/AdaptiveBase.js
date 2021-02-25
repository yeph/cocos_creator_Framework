cc.Class({
    extends: cc.Component,

    properties: {
        fitCanvas:{
            default: false,
            tooltip: "自动设置Canvas适配方式（横屏：Pad=fitWidth Phone=fitHeight，竖屏：Pad=fitHeight Phone=fitWidth",
            visible: function () { return this.getComponent(cc.Canvas) }
        },
        
        fitSize:{
            default: false,
            tooltip: "将背景图适配屏幕大小(针对全面屏)",
            // notify() {
            //     this.onLoad();
            // },
        },
        // fitType = EFitType.Auto;
    
        safeWidget:{
            default: false,
            tooltip: "在安全区域内适配Widget",
            visible: function () { return this.getComponent(cc.Widget) }
        },
        // sizeWidth:{
        //     default :0,
        //     type : cc.Float,
        //     tooltip: "当没有对齐组件的时候节点的宽设置",
        //     visible: function () { return (this.fitSize == false /*&& this.safeWidget == false*/) }
        // },
        // sizeHeight:{
        //     default :0,
        //     type : cc.Float,
        //     tooltip: "当没有对齐组件的时候节点的高设置",
        //     visible: function () { return (this.fitSize == false /*&& this.safeWidget == false*/)  }
        // },

        // freeWidgetTop:{
        //     default : 0,
        //     type : cc.Float,
        //     tooltip: "对齐顶部距离",
        //     visible: function () { return this.safeWidget == false }
        // },

        // freeWidgetBottom:{
        //     default : 0,
        //     type : cc.Float,
        //     tooltip: "对底顶部距离",
        //     visible: function () { return this.safeWidget == false }
        // },

        // freeWidgetLeft:{
        //     default : 0,
        //     type : cc.Float,
        //     tooltip: "对左边部距离",
        //     visible: function () { return this.safeWidget == false }
        // },

        // freeWidgetRight:{
        //     default : 0,
        //     type : cc.Float,
        //     tooltip: "对右边部距离",
        //     visible: function () { return this.safeWidget == false }
        // },
      
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad() {
        if (this.fitCanvas) {
            let canvas = this.getComponent(cc.Canvas);
            if (!canvas) return;
            let size = cc.view.getFrameSize();
            let aspectRatio = Math.max(size.width, size.height) / Math.min(size.width, size.height);
            if (aspectRatio < 1.77) {//Pad
                canvas.fitWidth = size.width > size.height;//横屏适配宽度
                canvas.fitHeight = size.width < size.height;//竖屏适配高度
            } else {//Phone
                canvas.fitWidth = size.width < size.height;//竖屏适配宽度
                canvas.fitHeight = size.width > size.height;//横屏适配高度
            }
        }
    },
    start() {
        if (this.fitSize) {
            let resize = ratio => {
                if (sprite?.sizeMode == cc.Sprite.SizeMode.CUSTOM) {//自定义大小
                    this.node.width *= ratio;
                    this.node.height *= ratio;
                } else {
                    this.node.scale = ratio;
                }
            }
            let wRatio = cc.winSize.width / this.node.width;
            let hRatio = cc.winSize.height / this.node.height;
            let aspectRatio = Math.max(cc.winSize.width, cc.winSize.height) / Math.min(cc.winSize.width, cc.winSize.height);
        
            let sprite = this.node.getComponent(cc.Sprite);
            if (aspectRatio > 1.77) {//Phone
                console.log(Math.max(wRatio, hRatio))
                resize(Math.max(wRatio, hRatio));
            }else{
                this.node.width = cc.winSize.width;
                this.node.height = cc.winSize.height;
            }
        }else{
            // if(this.sizeWidth>0 && !this.getComponent(cc.Widget)){
            //     this.node.width = this.sizeWidth;
            // }
            // if(this.sizeHeight>0 && !this.getComponent(cc.Widget)){
            //     this.node.height = this.sizeHeight;
            // }
        }
       
        if (this.safeWidget) {
            let widget = this.getComponent(cc.Widget);
            if (!widget) return;
            if (widget.isAlignTop) {
                if (cc.sys.platform == cc.sys.IPHONE) {
                    widget.top += globalData.safeSize.top * 0.7;
                } else {
                    widget.top += globalData.safeSize.top;
                }
            }
            if (widget.isAlignBottom) {
                if (cc.sys.platform == cc.sys.IPHONE) {
                    widget.bottom += globalData.safeSize.bottom * 0.6;
                } else {
                    widget.bottom += globalData.safeSize.bottom;
                }
            }
            if (widget.isAlignLeft) {
                widget.left += globalData.safeSize.left;
                console.log("widget.left",widget.left)
            }
            if (widget.isAlignRight) {
                widget.right += globalData.safeSize.right;
            }
            widget.updateAlignment();
        }/*else{
            // if (widget.isAlignTop) {
            //     widget.top = this.freeWidgetTop;
            // }
            // if (widget.isAlignBottom) {
            //     widget.bottom = this.freeWidgetBottom;
            // }
            // if (widget.isAlignLeft) {
            //     widget.left = this.freeWidgetLeft;
            // }
            // if (widget.isAlignRight) {
            //     widget.height = this.freeWidgetRight;
            // }
            // widget.updateAlignment();
        }*/
    }

    // update (dt) {},
});
