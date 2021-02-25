/*
 * @Author: jacklove
 * @Date: 2020-03-28 14:03:12
 * @LastEditTime: 2020-11-27 15:47:28
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\helper\ui18n\InterMgr.js
 */
module.exports = {

    _inter_map : {},
    _current_language : 'en',

    init()
    {
        this.__init__();
    },
    
    __init__()
    {
        // cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
            cc.loader.loadRes('I18n', cc.JsonAsset, null, (error, res_list) => {
                if (error) {
                    return;
                }
                // console.error(res_list);
                for (let index = 0; index < res_list.length; index++) {
                    // this.effectAssets[res[index]._name] = res_list[index];
                    this._loadLanguage(res_list[index]);
                }
                // this.effectAssets[] = res;
            });
        // });
    },

    _loadLanguage(asset)
    {
        // console.error(asset);
        this._inter_map[asset.name] = asset.json;
    },

    setLanguage(language)
    {
        this._current_language = language;
    },

    t(translate_string)
    {
        var json_map = this._inter_map[this._current_language];
        if (json_map == null) {
            return translate_string;
        }

        var result_string = json_map[translate_string];
        if (result_string != null) {
            return result_string;
        }
        return translate_string;
    },
};
// module.exports.__init__();