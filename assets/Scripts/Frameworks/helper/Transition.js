/*
 * @Description: Transition
 * @Author: jacklove
 * @Date: 2019-05-28 15:19:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-05 18:13:02
 */


cc.Class({
    name: 'Transition',

    properties : {
        m_target : {
            default: null,
            type: cc.Node,
            tooltip : '执行节点',
        },

        m_actionStack : new Array(),
    },

    statics : {

        create(node)
        {
            let Transition = require("Transition")
            var transition = new Transition();
            return transition.begin(node);
        },

    },

    start ()
    {
        // 用法
        
        // Transition.create(this.node)
        // .beginGroupSpawn()
        // .moveTo(5, 320, 340)
        // .scaleTo(5, 2.0, 2.0)
        // .endGroup()
        // .callFunction((target) => {
        //     console.log(target)
        // })
        // .runAction();
    },

    begin(target)
    {
        this.m_target = target;
        return this;
    },

    place(x, y)
    {
        this.m_actionStack.push(cc.place(x, y));
        return this;
    },

    moveTo(duration, x, y)
    {
        this.m_actionStack.push(cc.moveTo(duration, x, y));
        return this;
    },

    moveBy(duration, x, y)
    {
        this.m_actionStack.push(cc.moveBy(duration, x, y));
        return this;
    },

    scaleTo(duration, x, y)
    {
        this.m_actionStack.push(cc.scaleTo(duration, x, y));
        return this;
    },

    scaleBy(duration, x, y)
    {
        this.m_actionStack.push(cc.scaleBy(duration, x, y));
        return this;
    },

    rotateTo(duration, rotateX, rotateY)
    {
        this.m_actionStack.push(cc.rotateTo(duration, rotateX, rotateY));
        return this;
    },

    rotateBy(duration, rotateX, rotateY)
    {
        this.m_actionStack.push(cc.rotateBy(duration, rotateX, rotateY));
        return this;
    },

    jumpTo(duration, position, height, jumps)
    {
        this.m_actionStack.push(cc.jumpTo(duration, position, height, jumps));
        return this;
    },

    jumpBy(duration, position, height, jumps)
    {
        this.m_actionStack.push(cc.jumpBy(duration, position, height, jumps));
        return this;
    },

    fadeIn(duration)
    {
        this.m_actionStack.push(cc.fadeIn(duration));
        return this;
    },

    fadeOut(duration)
    {
        this.m_actionStack.push(cc.fadeOut(duration));
        return this;
    },

    fadeTo(duration, opacity)
    {
        this.m_actionStack.push(cc.fadeTo(duration, opacity));
        return this;
    },

    delay(duration)
    {
        this.m_actionStack.push(cc.delayTime(duration));
        return this;
    },

    // delay 同功能函数
    delayTime(duration)
    {
        this.m_actionStack.push(cc.delayTime(duration));
        return this;
    },

    show()
    {
        this.m_actionStack.push(cc.show());
        return this;
    },

    hide()
    {
        this.m_actionStack.push(cc.hide());
        return this;
    },

    bezierBy(duration, bezier)
    {
        this.m_actionStack.push(cc.bezierBy(duration, bezier));
        return this;
    },

    bezierTo(duration, bezier)
    {
        // console.error(duration, bezier)
        this.m_actionStack.push(cc.bezierTo(duration, bezier));
        return this;
    },

    removeSelf()
    {
        this.m_actionStack.push(cc.removeSelf());
        return this;
    },

    callFunction(callback)
    {
        this.m_actionStack.push(cc.callFunc(callback));
        return this;
    },

    //-------------- 组 --------------//
    beginGroupSpawn()
    {
        this.m_actionStack.push({ type : 'Spawn'});
        return this;
    },

    beginGroupRepeat(count)
    {
        this.m_actionStack.push({ type : 'Repeat', value : count});
        return this;
    },

    beginGroupRepeatForever()
    {
        this.m_actionStack.push({ type : 'RepeatForever', });
        return this;
    },

    beginGroupEase(easeClass, ...param)
    {
        this.m_actionStack.push({ type : 'Ease', value : easeClass, param : param });
        return this;
    },

    forIn(callback)
    {
        callback(this);
        return this;
    },

    endGroup()
    {
        var idx = -1;
        for (let index = this.m_actionStack.length - 1; index >= 0; index--) {
            const element = this.m_actionStack[index];
            if (element.hasOwnProperty('type')) {
                idx = index;
                break;
            }
        }

        if (this.m_actionStack.length - 1 == idx || idx == -1) {
            console.error('unpaired endGroup error');
        }

        var type = this.m_actionStack[idx].type;
        var value = this.m_actionStack[idx].value;
        var param = this.m_actionStack[idx].param;

        var action = null;
        if (type == 'Spawn') {
            var _actlist = this._getActFromList(idx + 1, this.m_actionStack.length - 1);
            // console.log(_actlist);
            action = cc.spawn(_actlist);
        }
        else
        {
            var sequence = null;
            if (idx == this.m_actionStack.length - 2) {
                sequence = this.m_actionStack[this.m_actionStack.length - 1];
            } else {
                var _actlist = this._getActFromList(idx + 1, this.m_actionStack.length - 1);
                sequence = cc.sequence(_actlist);
            }

            if (type == 'Repeat') {
                action = cc.repeat(sequence, value);
            } else if (type == 'RepeatForever') {
                action = cc.repeatForever(sequence, value);
            }
            else if (type == 'Ease') {
                // action = value(sequence);
                action = sequence.easing(value(...param));
            }
            else
            {
                console.error('Wrong type ', type);
            }
        }

        // console.warn('idx', idx);
        for (let index = this.m_actionStack.length - 1; index >= 0; index--) {
            if (index < idx) {
                break;
            }
            // console.warn(index, idx);
            this.m_actionStack.splice(index, 1);
        }

        this.m_actionStack.push(action);

        // console.log(this.m_actionStack);
        return this;
    },

    runAction()
    {
        if (this.m_actionStack.length > 1) {
            var action = cc.sequence(this.m_actionStack);
            this.m_actionStack = new Array();
            this.m_actionStack.push(action);
        }

	    this.m_target.runAction(this.m_actionStack[0]);
	    return this;
    },

    _getActFromList(idx1, idx2)
    {
        var list = new Array();
        for (let index = 0; index < this.m_actionStack.length; index++) {
            const element = this.m_actionStack[index];
            if (idx1 <= index && index <= idx2) {
                list.push(element)
            }
        }
        return list;
    },

});
