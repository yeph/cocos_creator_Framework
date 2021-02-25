/*
 * @Author: jacklove
 * @Date: 2019-11-25 09:10:58
 * @LastEditTime: 2020-07-27 15:52:05
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \NewProject_test\assets\Scripts\Frameworks\manager\SceneMgr.js
 */


module.exports = {

    m_load_data : null,
    m_loading_scene_name : '',
    
    loadScene(scene_name, data)
    {
        var _scene_name = this.toSceneName(scene_name);

        if (cc.isValid(cc.director.getScene())) {
            if (cc.director.getScene().name == _scene_name) {
                return;
            }
        }

        this.m_load_data = data;

        cc.director.loadScene(_scene_name);    
    },

    toSceneName(scene_name)
    {
        if (scene_name instanceof cc.SceneAsset) {
            return scene_name.name;
        }
        return scene_name;
    },

    getLoadData()
    {
        return this.m_load_data;
    },

    setLoading(scene_name)
    {
        this.m_loading_scene_name = scene_name;
    },

    loadingScene(scene_name)
    {
        var _scene_name = this.toSceneName(scene_name);
        if (this.m_loading_scene_name == '') {
            this.loadScene(_scene_name);
        }
        else
        {
            this.loadScene(this.m_loading_scene_name, _scene_name);
        }
    },

    isScene(scene_name)
    {
        var _scene_name = this.toSceneName(scene_name);

        if (cc.isValid(cc.director.getScene())) {
            if (cc.director.getScene().name == _scene_name) {
                return true;
            }
        }
        return false;
    },

};
