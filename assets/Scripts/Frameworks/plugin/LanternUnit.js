/*
 * @Author: jacklove
 * @Date: 2020-04-18 14:26:21
 * @LastEditTime: 2020-04-28 15:49:01
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\plugin\LanternUnit.js
 */
 	
let SCROLL_MODEL = cc.Enum({
    SCROLL_HORIZONTAL : 0,    // 横
    SCROLL_VERTICAL : 1,      // 竖
});

cc.Class({
    extends: cc.Component,

    properties: {
        scroll_model : {
            default: SCROLL_MODEL.SCROLL_HORIZONTAL,
            type : cc.Enum(SCROLL_MODEL), 
            tooltip : '滚动模式',
        },
        lbl_show : {
            default: null,
            type : cc.RichText, 
            tooltip : '显示文字',
        },
        run_speed : {
            default: 100,
            type : cc.Float, 
            tooltip : '移动速度',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.m_isRunning = false;
        this.m_datas = [];
        this.m_showInfo = null;
        // this.lbl_show.node.x = this.node.width / 2;
    },

    start () {
        // this.m_isRunning = true;
    },

    update (dt) {
        if (!this.m_isRunning) {
            return;
        }
        this.updateRun(dt);
    },

    updateRun(dt)
    {
        if (this.m_showInfo) {
            if (this.scroll_model == SCROLL_MODEL.SCROLL_HORIZONTAL) {
                this.lbl_show.node.x -= dt * this.run_speed;
                if (this.lbl_show.node.x + this.lbl_show.node.width <= -this.node.width / 2) {
                    this.m_showInfo = null;
                }                
            } else if (this.scroll_model == SCROLL_MODEL.SCROLL_VERTICAL) {
                this.lbl_show.node.y += dt * this.run_speed;
                if (this.lbl_show.node.y + this.lbl_show.node.height >= this.node.height * 2) {
                    this.m_showInfo = null;
                } 
            }

        } else {
            this.nextInfo();        
        }
    },

    isRunning()
    {
        return this.m_isRunning;
    },

    pushInfo(data)
    {
        if (!data.hasOwnProperty('priority')) {
            data.priority = 0;
        }

        if (data.priority < 0) {// 立刻
            this.m_datas.unshift(data);
            this.nextInfo();
        }
        else if (data.priority == 0) {// 正常顺序
            this.m_datas.push(data);
        }
        else
        {
            let isPush = true;
            for (let i = 0; i < this.m_datas.length; i++) {
                if (this.m_datas[i].priority < 0) {
                    continue;
                }
                if (this.m_datas[i].priority < data.priority) {
                    this.m_datas.splice(i, 0, data);
                    isPush = false;
                    break;
                }
                if (this.m_datas[i].priority > data.priority) {
                    this.m_datas.splice(i + 1, 0, data);
                    isPush = false;
                    break;
                }
            }
            if (isPush) {
                this.m_datas.push(data);
            }
        }

        this.m_isRunning = true;
        // console.error(this.m_datas);
    },

    nextInfo()
    {
        if (this.m_datas.length <= 0) {
            this.m_isRunning = false;
            return;
        }

        this.m_isRunning = true;
        this.m_showInfo = this.m_datas.shift();
        this._setInfo();
    },
    
    _setInfo()
    {
        if (this.m_showInfo == null) {
            return;
        }

        this.lbl_show.string = this.m_showInfo.text;
        if (this.scroll_model == SCROLL_MODEL.SCROLL_HORIZONTAL) {
            this.lbl_show.node.x = this.node.width / 2;               
        } else if (this.scroll_model == SCROLL_MODEL.SCROLL_VERTICAL) {
            this.lbl_show.node.y = -1 * this.node.height;
        }
    },
});
