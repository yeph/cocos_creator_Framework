/*
 * @Description: In User Settings Edit
 * @Author: jacklove
 * @Date: 2019-08-27 10:03:28
 * @LastEditors: jacklove
 * @LastEditTime: 2019-10-23 17:50:58
 */

let PoolDef = require('PoolDef')
let PoolMgr = require("PoolMgr")

cc.Class({
    // extends: cc.Component,

    name : 'PoolPlug',

    properties: {
        plugList : {
            default : [],
            type : [cc.Node],
            tooltip : '节点列表',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // onDestroy()
    // {
    //     this.clearPlug();
    // },

    // start () {

    // },

    // update (dt) {},

    _getNode_(index)
    {
        return this.plugList[index];
    },

    pushPlug(poolname, index = 0, callback)
    {
        var node = this._getNode_(index);
        if (node == null) {
            console.error('父节点索引[' + index + ']没有找到');
            return null; 
        }

        PoolMgr.getPerfab(poolname, (prefabNode) => {
            if (callback) {
                callback(prefabNode);
            }
            node.addChild(prefabNode);         
        });
    },

    getPlug(poolname)
    {
        for (let i = 0; i < this.plugList.length; i++) {
            const node = this.plugList[i];
            for (let index = 0; index < node.children.length; index++) {
                const child = node.children[index];
                if (child.getComponent('PoolUnit').getPoolName() == poolname) {
                    return child;
                }
            }
        }

        return null;
    },

    getAllPlug()
    {
        var list = new Array();
        for (let i = 0; i < this.plugList.length; i++) {
            const node = this.plugList[i];
            for (let index = 0; index < node.children.length; index++) {
                const child = node.children[index];
                list.push(child);
            }
        }
        return list;
    },

    removePlug(poolname)
    {
        for (let i = 0; i < this.plugList.length; i++) {
            const node = this.plugList[i];
            for (let index = node.children.length - 1; index >= 0; index--) {
                const child = node.children[index];
                if (child.getComponent('PoolUnit').getPoolName() == poolname) {
                    PoolMgr.recoveryUnit(child);
                }
            }
        }
    },

    clearPlug()
    {
        for (let i = 0; i < this.plugList.length; i++) {
            const node = this.plugList[i];
            for (let index = node.children.length - 1; index >= 0; index--) {
                const child = node.children[index];
                PoolMgr.recoveryUnit(child);
            }
        }
    },

});
