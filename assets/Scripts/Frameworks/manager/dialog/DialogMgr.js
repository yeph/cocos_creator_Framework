/*
 * @Author: jacklove
 * @Date: 2019-12-11 15:20:29
 * @LastEditTime: 2020-12-11 17:57:24
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\manager\dialog\DialogMgr.js
 */

module.exports = {
    m_register_list : new Object(), // 注册列表
    m_alloc_index : 0,              // 分配索引
    m_baseZIndex : 1000,            // 基础ZIndex
    m_dialogs : new Array(),        // 对话框节点列表
    m_maskPool : new cc.NodePool(), // 遮罩节点池
    m_masks : new Array(),          // 遮罩节点列表
    m_maskIndex : 0,                // 遮罩索引
    m_factory : new Object(),       // 工厂状态
    m_create_cmd : new Array(),     // 创建指令
    m_showList : new Array(),       // 显示队列
    m_showLastID : -1,
    m_maskModel : 0,
    m_register_tab_name : 'Unit/dialog_register', // 注册表名字

    _itemNum:0,
    get itemNum(){
        return this._itemNum;
    },
    set itemNum(value){
        console.log("11111111111111111")
        this._itemNum = value;
        console.log(this._itemNum)
        this.showItem();
    },

    showItem(){
        console.log("444444444444444")
        console.log(this.itemNum)
    },

    init()
    {
        // cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {

            cc.resources.load(this.m_register_tab_name, cc.JsonAsset, (err, res) => {
                // console.error(error, res);
                if (err) { return; }
                // cc.log(JSON.stringify(res.json));
                this.m_register_list = res.json;
                this._initToPool();
            });
        // });
    },

    __init__()
    {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LOADING, this.beforeSceneLoading.bind(this));
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.afterSceneLaunch.bind(this));
    },

    afterSceneLaunch(scene_name)
    {
        // 清理所有预制体
        this.m_maskPool.clear();
        this.m_factory = new Object();
    },

    beforeSceneLoading(scene_name)
    {

    },

    registerDialog(id_map)
    {
        unit.DialogDef.DialogID = cc.Enum(id_map);
    },

    _initToPool()
    {
        for (const url in this.m_register_list) {
            unit.PoolMgr.initPool(url, url);
        }
    },

    getDialogLoadInfo(dlg_id)
    {
        for (const dlg_name in this.m_register_list) {
            const dlg_info = this.m_register_list[dlg_name];
            // console.error(dlg_info);
            if (dlg_id == dlg_info.dlg_id) {
                return dlg_info;
            }
        }
        return null;
    },
	
    addShowList(dlg_id, params = {}, priority = 0)
    {
        var data = {dlg_id : dlg_id, params : params, priority : priority, };
        if (priority > 0) {
            let isPush = true;
            for(let i = this.m_showList.length - 1; i >=0; i--) {
                if ( this.m_showList[i].priority < priority) {
                    this.m_showList.splice(i + 1, 0, data);
                    isPush = false;
                    break;
                }
            }
            if (isPush) {
                this.m_showList.splice(0, 0, data);
            }
        } else {
            this.m_showList.push(data);
        }
    },
 
    clearShowList()
    {
        this.m_showList.length = 0;
        this.m_showLastID = -1;
    },
 
    showList(close_id = -1)
    {
        // console.error(close_id, this.m_showList);
        if (this.m_showList.length <= 0) {
            return;
        }
 
        var data = this.m_showList[0];
        if (close_id == -1 || close_id == this.m_showLastID) {
            this.showDialog(data.dlg_id, data.params);
            this.m_showLastID = data.dlg_id;
            this.m_showList.splice(0, 1);
        }
    },

    setMaskModel(model)
    {
        this.m_maskModel = model;
    },

    showDialog(dlg_id, params = {})
    {
        let dlg_info = this.getDialogLoadInfo(dlg_id);
        if (dlg_info == null) { console.error('对话框不存在 id =[' + dlg_id + ']'); return; }

        this.newDialog(dlg_info, params);
    },

    newDialog(dlg_info, params)
    {
        let dlg_id = dlg_info.dlg_id;
        let state = this._getFactoryState(dlg_id);

        if (dlg_info.single == false) { // 非单一直接创建
            this._createDialog(dlg_id, params);
            return;
        }

        let _dlg_comp_ = this._getDialogComponent(dlg_id);

        if (_dlg_comp_ != null) { // 当前对话框存在，直接走重新打开
            this.reopenDialog(dlg_id, params);
            return;
        }

        if (state == 'creating') {
            this._saveCmd(dlg_id, params);
            return;
        }

        this._createDialog(dlg_id, params);
    },

    _createDialog(dlg_id, params)
    {
        this._setFactoryState(dlg_id, 'creating');
        
        let zIndex = this.allocDialogIndex();
        let mask_id = this.allocMaskIndex();

        var dlg_name = this._getNameById(dlg_id);
        unit.PoolMgr.getPerfab(dlg_name, (_dlg_node_) => {
            if (cc.isValid(_dlg_node_)) { 
                this._initDialog(_dlg_node_, dlg_id, mask_id, params, zIndex); 
            }
            else {
                console.error('[' + dlg_id + ']创建失败');
            }
            this._setFactoryState(dlg_id, 'created');
        });
    },

    // 分配对话框层级索引
    allocDialogIndex()
    {
        this.m_alloc_index += 1;
        var audo_index = this.m_alloc_index + this.m_baseZIndex;
        if (audo_index > cc.macro.MAX_ZINDEX) {
            audo_index = cc.macro.MAX_ZINDEX;
        }
        return audo_index;
    },

    _getDialogComponent(dlg_id)
    {
        var _dlg_node_ = this.getDialog(dlg_id);
        if (!cc.isValid(_dlg_node_)) { return null; }
        var _dlg_comp_ = _dlg_node_.getComponent('DialogBase');
        return _dlg_comp_;
    },

    // 重新打开弹窗
    reopenDialog(dlg_id, params)
    {
        var zIndex = this.allocDialogIndex();
        var _dlg_comp_ = this._getDialogComponent(dlg_id);
        if (_dlg_comp_) {
            // 重置显示层级
            this.setDialogZIndex(_dlg_comp_.node, zIndex);
            // 重调进入函数
            _dlg_comp_.onEnter(params);

            var dlg_state = _dlg_comp_._getState();
            if (dlg_state == unit.DialogDef.DialogState.closing || dlg_state == unit.DialogDef.DialogState.closed) {
                // 重新播放开启动画
                _dlg_comp_._playOpenAni();
            }

            this._autoMaskModel();
        }
    },

    getDialog(dlg_id)
    {
        for (let i = this.m_dialogs.length - 1; i >= 0; i--) {
            const _dlg_node_ = this.m_dialogs[i];
            if (!cc.isValid(_dlg_node_)) {
                continue;
            }
            var dlg_comp = _dlg_node_.getComponent('DialogBase');
            if (dlg_comp._getDialogId() == dlg_id) {
                return _dlg_node_;
            }
        }
        return null;
    },

    getAllDialog(dlg_id)
    {
        var res_list = [];
        for (let i = this.m_dialogs.length - 1; i >= 0; i--) {
            const _dlg_node_ = this.m_dialogs[i];
            if (!cc.isValid(_dlg_node_)) {
                continue;
            }
            var dlg_comp = _dlg_node_.getComponent('DialogBase');
            if (dlg_comp._getDialogId() == dlg_id) {
                res_list.push(_dlg_node_);
            }
        }
        return res_list;
    },

    closeDialog(dlg_node)
    {
        // console.error(dialog_node)
        var _dlg_node_ = dlg_node;
        // console.log(typeof dialog);
        if (typeof dlg_node == 'string') {
            _dlg_node_ = this.getDialog(dlg_node);
        }

        if (cc.isValid(_dlg_node_)) {
            _dlg_node_.getComponent('DialogBase')._playCloseAni();
        } 
    },

    closeAllDialog()
    {
        // console.log(this.m_dialogs);
        for (let i = this.m_dialogs.length - 1; i >= 0; i--) {
            const _dlg_node_ = this.m_dialogs[i];
            this.closeDialog(_dlg_node_);
        }
    },

    setDialogZIndex(dlg_node, zIndex)
    {
        var dlg_comp = dlg_node.getComponent('DialogBase');

        var mask_node = this._getMask(dlg_comp._getMaskId());
        if (cc.isValid(mask_node)) {
            mask_node.zIndex = zIndex - 1;
        }
        
        dlg_node.zIndex = zIndex;
        this._autoMaxZIndex();
    },

    _closeDialog(dlg_node)
    {
        let dlg_comp = dlg_node.getComponent('DialogBase');
        let dlg_id = dlg_comp._getDialogId();
        let dlg_name = this._getNameById(dlg_id);
        let maskId = dlg_comp._getMaskId();
        dlg_comp.onLeave();

        unit.PoolMgr.recoveryPerfab(dlg_name, dlg_node);

        for (let i = 0; i < this.m_dialogs.length; i++) {
            const _dlg_node_ = this.m_dialogs[i];
            if (dlg_node == _dlg_node_) {
                this.m_dialogs.splice(i, 1);
                break;
            }
        }
        
        this._subMask(maskId);
        this._autoMaxZIndex();
        this._autoMaskModel();
        this.showList(dlg_id);
    },

    _removeDialog(dlg_node)
    {
        // cc.log('_removeDialog');
        let dlg_comp = dlg_node.getComponent('DialogBase');

        // 移除mask
        let maskId = dlg_comp._getMaskId();
        this._subMask(maskId);

        // 对话框死亡
        dlg_comp.onDead();

        // 移除对话框主体
        let dlg_name = this._getNameById(dlg_comp._getDialogId());
        unit.PoolMgr.removeUsedPerfab(dlg_name, dlg_node);

        // 移除对话框引用
        for (let i = 0; i < this.m_dialogs.length; i++) {
            const _dlg_node_ = this.m_dialogs[i];
            if (dlg_node == _dlg_node_) {
                this.m_dialogs.splice(i, 1);
                break;
            }
        }

        this._autoMaxZIndex();
    },

    _autoMaxZIndex()
    {
        var active_amount = 0;
        for (let i = 0; i < this.m_dialogs.length; i++) {
            const _dlg_node_ = this.m_dialogs[i];
            if (cc.isValid(_dlg_node_)) { active_amount++; }
        }

        if (active_amount <= 0) { this.m_alloc_index = 0; }
        // console.log('_autoMaxZIndex', this.m_alloc_index);
    },

    // 设置对话框创建状态
    _setFactoryState(dlg_id, state)
    {
        var dlg_name = this._getNameById(dlg_id);
        this.m_factory[dlg_name] = state;
    },

    // 获得对话框创建状态
    _getFactoryState(dlg_id)
    {
        var dlg_name = this._getNameById(dlg_id);
        if (!this.m_factory[dlg_name]) {
            this.m_factory[dlg_name] = 'init';
        }
        return this.m_factory[dlg_name];
    },

    _saveCmd(dlg_id, params)
    {
        this.m_create_cmd.push({dlg_id : dlg_id, params : params, });
    },

    _getCmd(dlg_id)
    {
        let cmd = null;
        for (let i = this.m_create_cmd.length - 1; i >= 0; i--) {
            const _cmd = this.m_create_cmd[i];
            if (_cmd.dlg_id = dlg_id) {
                cmd = _cmd;
                this.m_create_cmd.splice(i, 1);
            }
        }
        return cmd;
    },

    _initDialog(dlg_node, dlg_id, mask_id, params, zIndex)
    {
        this._createMask(mask_id, zIndex);
        this._getParent().addChild(dlg_node, zIndex);
        this.m_dialogs.push(dlg_node);
        
        dlg_node.setPosition(cc.v2(0, 0));
        var _dlg_comp_ = dlg_node.getComponent('DialogBase');
        _dlg_comp_._setMaskId(mask_id);
        // init
        this.setMaskMask(mask_id, _dlg_comp_._getIsMask());
        this.setMaskInput(mask_id, _dlg_comp_._getIsInput());
        this.setMaskOpacity(mask_id, _dlg_comp_.maskOpacity);

        _dlg_comp_.onEnter(params);

        let cmd = this._getCmd(dlg_id);
        if (cmd != null) {
            _dlg_comp_.onEnter(cmd.params);
        }

        _dlg_comp_._playOpenAni();

        this._autoMaskModel();
    },

    _createMask(mask_id, zIndex)
    {
        var _mask_node_ = this.m_maskPool.get();

        if (!cc.isValid(_mask_node_))
        {
            _mask_node_ = new cc.Node('DialogMask');

            // create input
            var inputNode = new cc.Node('inputNode');
            inputNode.addComponent(cc.BlockInputEvents);
            inputNode.setContentSize(cc.winSize);
            _mask_node_.addChild(inputNode);

            // create black mask
            var maskNode = new cc.Node('maskNode');
            let graph = maskNode.addComponent(cc.Graphics);
            graph.fillColor = new cc.Color(0, 0, 0, 255 * 0.6);
            graph.fillRect(-cc.winSize.width / 2, -cc.winSize.height / 2, cc.winSize.width, cc.winSize.height);
            maskNode.setContentSize(cc.winSize);
            _mask_node_.addChild(maskNode);
        }

        this._getParent().addChild(_mask_node_, zIndex - 1);
        _mask_node_.setPosition(cc.v2(0, 0));
        _mask_node_.__maskId__ = mask_id;
        this.m_masks.push(_mask_node_);

    },

    _autoMaskModel()
    {
        if (this.m_maskModel == unit.DialogDef.MaskModel.more) {
            return;
        }

        let max_node = null;
        let max_zIndex = -1;
        for (let i = 0; i < this.m_masks.length; i++) {
            const _mask_node_ = this.m_masks[i];
            if (!cc.isValid(_mask_node_)) {
                continue;
            }
            if (_mask_node_.zIndex > max_zIndex) {
                max_zIndex = _mask_node_.zIndex;
                max_node = _mask_node_;
            }
            _mask_node_.active = false;
            // if (_mask_node_.__maskId__ == mask_id) 
            // {
            //     return _mask_node_;
            // }
        }
        
        if (cc.isValid(max_node)) {
            max_node.active = true;
        }
        
    },

    _subMask(mask_id)
    {
        for (let i = 0; i < this.m_masks.length; i++) {
            const _mask_node_ = this.m_masks[i];
            if (!cc.isValid(_mask_node_)) {
                continue;
            }
            if (_mask_node_.__maskId__ == mask_id) 
            {
                this.m_maskPool.put(_mask_node_);
                this.m_masks.splice(i, 1);
                break;
            }
        }
    },

    _getMask(mask_id)
    {
        for (let i = 0; i < this.m_masks.length; i++) {
            const _mask_node_ = this.m_masks[i];
            if (!cc.isValid(_mask_node_)) {
                continue;
            }
            if (_mask_node_.__maskId__ == mask_id) 
            {
                return _mask_node_;
            }
        }
        return null;
    },

    setMaskInput(mask_id, input)
    {
        var _mask_node_ = this._getMask(mask_id);
        if (_mask_node_) {
            _mask_node_.getChildByName('inputNode').active = input;
        }
    },

    setMaskMask(mask_id, mask)
    {
        var _mask_node_ = this._getMask(mask_id);
        if (_mask_node_) {
            _mask_node_.getChildByName('maskNode').active = mask;
        }
    },

    setMaskOpacity(mask_id, opacity)
    {
        var _mask_node_ = this._getMask(mask_id);
        if (_mask_node_) {
            var _mask_ = _mask_node_.getChildByName('maskNode');
            let graph = _mask_.getComponent(cc.Graphics);
            graph.clear();
            graph.fillColor = new cc.Color(0, 0, 0, opacity);
            graph.fillRect(-cc.winSize.width / 2, -cc.winSize.height / 2, cc.winSize.width, cc.winSize.height);
        }
    },

    allocMaskIndex()
    {
        return ++this.m_maskIndex;
    },

    _getNameById(dlg_id)
    {
        for (const dlg_name in this.m_register_list) {
            const dlg_info = this.m_register_list[dlg_name];
            if (dlg_id == dlg_info.dlg_id) {
                return dlg_name;
            }
        }
        return '';
    },

    _getParent()
    {
        // return cc.director.getScene();
        return cc.director.getScene().getChildByName('Canvas');
    },

    listen(callback, cls, priority = 0) 
    {
        unit.EventMgr.listen_s('_dialog_mgr_', unit.DialogDef.DialogEvent, callback, cls, priority);
    },

    dispatch(dialog_id, data)
    {
        unit.EventMgr.dispatch_s('_dialog_mgr_', unit.DialogDef.DialogEvent, {dialog_id : dialog_id, data : data});
    },

    // 保存信息，编辑器内生效
    saveInfo(dlg_id, node_name, dlg_info)
    {
        if (!CC_EDITOR) { return; }
        // cc.log(dlg_id, node_name, dlg_info);
        this._tryGetPrefabInfo(node_name, (prefab_info)=>{
            if (!prefab_info) { return; }
            // cc.log(JSON.stringify(prefab_info));
            this._updateDialogInfo(dlg_id, prefab_info, dlg_info);               
        });
    },

    _getPathUrl(prefab_info)
    {
        let _url = prefab_info.url;

        let path = 'db://assets/resources/';
        _url = _url.replace(path, '');
        _url = _url.replace('.prefab', '');
        return _url;
    },

    _updateDialogInfo(dlg_id, prefab_info, dlg_info)
    {
        this._isFileExists((isExist)=>{
            let path = 'db://assets/resources/';
            let file_name = this.m_register_tab_name + '.json';

            if (isExist) 
            {
                cc.resources.load(this.m_register_tab_name, cc.JsonAsset, (error, res) => {
                    if (error) { return; }
                    res.json[this._getPathUrl(prefab_info)] = dlg_info;
                    // cc.log(res.json);
                    Editor.assetdb.saveExists(path + file_name, JSON.stringify(res.json));
                });
            }
            else
            {
                let info = {};
                info[this._getPathUrl(prefab_info)] = dlg_info;
                Editor.assetdb.create(path + file_name, JSON.stringify(info)); 
            }  
        });
    },

    _tryGetPrefabInfo(prefab_name, callback)
    {
        let dialog_path = 'db://assets/resources/**\/**/' + prefab_name + '.prefab';
        Editor.assetdb.queryAssets(dialog_path, Editor.assettype2name[cc.js.getClassName(cc.Prefab)], function (err, results) {
            // cc.log(JSON.stringify(results));
            if (err) { if(callback) { callback(null); } return; }
            if(callback) { callback(results[0]); }
        });
    },

    _isFileExists(callback)
    {
        let path = 'db://assets/resources/';
        let file_name = this.m_register_tab_name + '.json';

        Editor.assetdb.queryAssets(path + file_name, Editor.assettype2name[cc.js.getClassName(cc.JsonAsset)], function (err, results) {
            if (err) { callback(false); }
            else { callback(results.length > 0); }
        });
    },
};

module.exports.__init__();