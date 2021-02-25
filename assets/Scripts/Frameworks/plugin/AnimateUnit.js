// animate 插件
// create by jacklove
// 挂到和 [cc.Animation] 同级的脚本上

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._anim = this.node.getComponent(cc.Animation);
        this._anim.on('finished', this.playEnd.bind(this), this);
        this._aniEvent = null;
    },

    play(data)
    {
        if (data.hasOwnProperty('pos')) {
            this.node.setPosition(cc.v2(data.pos.x, data.pos.y));
        }

        if (data.hasOwnProperty('scale')) {
            this.node.setScale(data.scale);
        }

        if (data.hasOwnProperty('name')) {
            this._anim.play(data.name);
        }

        // // 清理监听
        this._aniEvent = null;
        if (data.hasOwnProperty('aniEvent')) {
            this._aniEvent = data.aniEvent;
        }
    },

    // onPlay: function (type, state) {
    //     // callback
    // },

    playEnd()
    {
        if (this._aniEvent) {
            this._aniEvent(this.node, 'Complete');
        }
    },

    // update (dt) {},
});
