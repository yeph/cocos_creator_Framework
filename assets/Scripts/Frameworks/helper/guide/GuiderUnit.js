/*
 * @Author: jacklove
 * @Date: 2020-04-23 09:39:01
 * @LastEditTime: 2020-08-12 14:21:44
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\helper\guide\GuiderUnit.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        node_id:
        {
            default: 0,
            type : cc.Integer,
            tooltip : '节点id',
        },

        guide_url : {
            default : '',
            tooltip : 'uuid',
            displayName : 'uuid',
            readonly : true,
        },
    },

    editor : {
        executeInEditMode : true,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        unit.GuideHelper.setNodeID(this.node, this.node_id);
        if (CC_EDITOR) {
            this.guide_url = unit.CocosHelper.findNodePath(this.node);
        }
        
    },

    start () {

    },

    // update (dt) {},
});
