/*
 * @Author: jacklove
 * @Date: 2020-12-14 18:27:09
 * @LastEditTime: 2021-01-17 17:32:43
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\AbilityMgr.js
 */

module.exports = {

    m_configs : [],
    m_ability_infos : {},
    m_ability_class : {},
    m_ability_list : [],

    loadConfig(path, callback)
    {
        cc.resources.loadDir(path, cc.JsonAsset, null, (err, res) => {
            // console.error(err, res);
            if (err) {
                if (callback) { callback(); }
                return;
            }

            this.m_configs.length = 0;
            for (let i = 0; i < res.length; i++) {
                this.m_configs.push(res[i].json);
            }
            console.error(this.m_configs);
            this._initCfg();
            
            if (callback) { callback(); }
        });

        // this.initRegister();
    },

    getConfig(id)
    {
        for (let i = 0; i < this.m_configs.length; i++) {
            const cfg = this.m_configs[i];
            if (cfg.id == id) {
                return cfg;
            }
        }
        return null;
    },

    _initCfg()
    {
        for (let i = 0; i < this.m_configs.length; i++) {
            const cfg = this.m_configs[i];
            this.initAbilityCfg(cfg);
        }
    },

    initAbilityCfg(cfg)
    {
        // let AbilityBase = require('./AbilityBase');
        // let ability = new AbilityBase(cfg.id);
        this.m_ability_infos['ability_' + cfg.id] = cfg;
    },

    init(path, callback)
    {
        cc.resources.load(path, cc.JsonAsset, (err, res)=>{
            if (err) {
                console.error(err);
                if (callback) { callback(); }
                return;
            }
            this.m_configs.length = 0;
            for (let i = 0; i < res.json.length; i++) {
                this.m_configs.push(res.json[i]);
            }
        });
        this.initRegister();
        this.initEvent();
    },

    initRegister()
    {
        this.registerAbilityClass('BaseDamage', require('./Base/BaseDamage'));
        this.registerAbilityClass('BaseHealth', require('./Base/BaseHealth'));
        this.registerAbilityClass('BaseExtraAttri', require('./Base/BaseExtraAttri'));
    },

    initEvent()
    {
        uGS.EventMgr.listen(this.onEvent, this);
    },

    onEvent(msg)
    {
        // console.error(msg);
        for (let i = 0; i < this.m_ability_list.length; i++) {
            const ability = this.m_ability_list[i];
            ability.onEvent(msg);

            // uGS.Logic.cast_skill(msg.caster_id, msg.params.ability_id, msg.params.targetIds);
        }
    },

    registerAbilityClass(class_name, class_base)
    {
        this.m_ability_class[class_name] = class_base;
    },

    _getClassBase(class_name)
    {
        if (Object.hasOwnProperty.call(this.m_ability_class, class_name)) {
            return this.m_ability_class[class_name];
        }
        return null;
    },

    createAbility(ability_id)
    {
        let config = this.getConfig(ability_id);

        if (config == null) {
            return;
        }
        let class_base = this._getClassBase(config.class_name);
        if (class_base) {
            let ability = new class_base(ability_id);
            ability.initByConfig(config);
            this.m_ability_list.push(ability);
            return ability;
        }
        return null;
    },

    clearAll()
    {
        this.m_ability_list.length = 0;
    },

    getAbilityInfo(id)
    {
        let ability = this.m_ability_infos['ability_' + id];
        return ability;
    },

    execute(caster_id, ability_id, target_ids = [])
    {
        let ability = this.getAbility(ability_id);
        if (ability == null) {
            return;
        }

        ability.execute(caster_id, target_ids);
    },
};