/*
 * @Author: jacklove
 * @Date: 2020-04-10 10:46:16
 * @LastEditTime: 2021-01-06 12:30:02
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\helper\CocosHelper.js
 */

cc.Node.prototype.setId = function (id) {
    this.m_id = id;
}

cc.Node.prototype.getId = function () {
    return this.m_id;
}

module.exports = {

    _camera_node_ : null,
    _camera_ : null,
    m_fullPath : '/storage/emulated/0/',

    treeNode(node = cc.director.getScene()) {
        let nameStyle =
            `color: ${node.parent === null || node.activeInHierarchy ? 'green' : 'grey'}; font-size: 14px;font-weight:bold`;
        let nameValue = `%c${node.name}`;
        if (node.childrenCount > 0) {
            console.groupCollapsed(nameValue, nameStyle);
            for (let i = 0; i < node.childrenCount; i++) {
                this.treeNode(node.children[i]);
            }
            console.groupEnd();
        } else {
            console.log(nameValue, nameStyle);
        }
    },

    findNodeByTouch(touch_pos, node)
    {
        if (!cc.isValid(node)) {
            if (cc.isValid(cc.director.getScene())) {
                node = cc.director.getScene().getChildByName('Canvas');
            }
            else
            {
                return null;
            }
        }

        let result_list = [];
        this._findNodeIn(touch_pos, node, result_list);
        if (result_list.length > 0) {
            return result_list[result_list.length - 1];
        }
        return null;
    },

    _findNodeIn(touch_pos, node, result_list)
    {
        var world_pos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        var size = node.getContentSize();
        var polygon = [
            cc.v2(world_pos.x + size.width / 2, world_pos.y + size.height / 2),
            cc.v2(world_pos.x - size.width / 2, world_pos.y + size.height / 2),
            cc.v2(world_pos.x - size.width / 2, world_pos.y - size.height / 2),
            cc.v2(world_pos.x + size.width / 2, world_pos.y - size.height / 2),
        ]
        if (cc.Intersection.pointInPolygon(touch_pos, polygon)) {
            result_list.push(node);
        }

        // for (let i = node.children.length - 1; i >= 0; i--) 
        for (let i = 0; i < node.children.length - 1; i++)
        {
            const child = node.children[i];
            this._findNodeIn(touch_pos, child, result_list);
        }
    },

    findNodeById(id, node)
    {
        if (!cc.isValid(node)) {
            if (cc.isValid(cc.director.getScene())) {
                node = cc.director.getScene().getChildByName('Canvas');
            }
            else
            {
                return null;
            }
        }
        if (node.m_id && node.m_id == id) {
            return node;
        }

        for (let index = node.children.length - 1; index >= 0; index--) {
            const child = node.children[index];
            var find_node = this.findNodeById(id, child);
            if (find_node) {
                return find_node;
            }
        }

        return null;
    },

    findNodePath(node)
    {
        if (!cc.isValid(node)) { return ''; }

        if (node instanceof cc.Node) { }
        else { node = node.node; }

        if (!cc.isValid(node)) { return ''; }

        return this._findPath(node, node.name);
    },

    _findPath(node, sPath)
    {
        if (!cc.isValid(node)) { return sPath; }

        if (node instanceof cc.Node) { }
        else { node = node.node; }

        if (!cc.isValid(node)) { return sPath; }

        if (!cc.isValid(node.getParent())) { return sPath; }
        else { sPath = node.getParent().name + '/' + sPath; }

        return this._findPath(node.getParent(), sPath);
    },

    capture(file_name, camera = null)
    {
        if (cc.isValid(camera)) {
            this._camera_ = camera;
            let texture = new cc.RenderTexture();
            texture.initWithSize(cc.winSize.width, cc.winSize.height, cc.gfx.RB_FMT_S8);
            this._camera_.targetTexture = texture;
        }
        else
        {
            this._createCamera();
        }
        

        this._camera_.render();

        let data = this._camera_.targetTexture.readPixels();
        var _width = this._camera_.targetTexture.width;
        var _height = this._camera_.targetTexture.height;
        let picData = this.filpYImage(data, _width, _height);
        this.saveFile(picData, _width, _height, file_name);
        return picData;
    },

    _createCamera()
    {
        if (cc.isValid(this._camera_node_)) {
            return;
        }

        this._camera_node_ = new cc.Node();
        this._camera_node_.parent = cc.director.getScene().getChildByName('Canvas');
        this._camera_ = this._camera_node_.addComponent(cc.Camera);

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.winSize.width, cc.winSize.height, cc.gfx.RB_FMT_S8);
        this._camera_.targetTexture = texture;
    },

    saveFile(picData, width, height, file_name) {
        if (!cc.sys.isNative) {
            return;
        }

        let filePath = jsb.fileUtils.getWritablePath() + file_name + '.png';
        // let filePath = this.m_fullPath + file_name + '.png';
        // console.error("saveFile", filePath);
        let success = jsb.saveImageData(picData, width, height, filePath);
        if (success) {
            unit.log("save image data success, file: " + filePath);
        }
        else {
            unit.error("save image data failed!");
        }
    },

    filpYImage(data, width, height) {
        // create the data array
        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        return picData;
    },
};