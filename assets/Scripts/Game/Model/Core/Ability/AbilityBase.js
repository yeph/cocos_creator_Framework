/*
 * @Author: jacklove
 * @Date: 2020-12-14 17:19:21
 * @LastEditTime: 2021-01-17 16:15:15
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\Ability\AbilityBase.js
 */

class AbilityBase {

    #m_nId = 0;
    #m_nCD = 0;
    #m_nType = 0;
    #m_data = new Object();

    constructor(id)
    {
        this.#m_nId = id;
    };

    getId() { return this.#m_nId; };

    setCD(cd) { this.#m_nCD = cd; };
    getCD() { return this.#m_nCD; };

    setType(type) { this.#m_nType = type; };
    getType() { return this.#m_nType; };

    setValue(key, value) { this.#m_data[key] = value; };

    getValue(key, value = null)
    {
        if (Object.hasOwnProperty.call(this.#m_data, key)) {
            return this.#m_data[key];
        }
        return value;
    };

    initByConfig(config)
    {
        if (Object.hasOwnProperty.call(config, 'cd')) {
            this.setCD(config.cd);
        }
        if (Object.hasOwnProperty.call(config, 'type')) {
            this.setType(config.type);
        }
    };

    execute(caster_id, target_ids) {};

    onEvent(msg) {};
};

module.exports = AbilityBase;