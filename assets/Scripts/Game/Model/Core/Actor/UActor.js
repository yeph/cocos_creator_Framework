/*
 * @Author: jacklove
 * @Date: 2020-12-14 15:59:17
 * @LastEditTime: 2021-01-17 17:02:41
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\Actor\UActor.js
 */

class UActor {

    #m_nSpeed = 0;
    #m_nId = 0;
    #m_abilitys = new Array();      // 能力列表
    #m_attris = new Array();    // 属性列表

    constructor(id)
    {
        this.#m_nId = id;
    };

    getId() { return this.#m_nId; };

    // 添加技能
    pushAbility(ability) { this.#m_abilitys.push(ability); };

    getAbilityList() { return this.#m_abilitys; };

    // 获得技能
    getAbility(ability_id)
    {
        for (let i = 0; i < this.#m_abilitys.length; i++) {
            const ability = this.#m_abilitys[i];
            if (ability.getId() == ability_id) {
                return ability;
            }
        }
        return null;
    };

    // 添加属性
    setAttri(attri) { this.#m_attris.push(attri); };

    // 获得属性
    getAttri(key, origin)
    {
        // if (this.#m_attris.hasOwnProperty(key)) {
        //     return this.#m_attris[key];
        // }
        for (let i = 0; i < this.#m_attris.length; i++) {
            const attri = this.#m_attris[i];
            if (attri.getName() == key && attri.getOrigin() == origin) {
                return attri;
            }
        }
        return null;
    };

    // 获得属性
    getAttriList(key)
    {
        let list = [];
        for (let i = 0; i < this.#m_attris.length; i++) {
            const attri = this.#m_attris[i];
            if (attri.getName() == key) {
                list.push(attri);
            }
        }
        return list;
    };

    // 获得属性值
    getAttriValue(key, origin, value = null)
    {
        let attri = this.getAttri(key, origin);
        if (attri == null) {
            return value;
        }
        return attri.getValue();
    };

    // 修改属性
    modifyAttriValue(key, origin, value)
    {
        let attri = this.getAttri(key, origin);
        if (attri == null) {
            return false;
        }

        let val = attri.getValue();
        val += value;
        attri.setValue(val);
        return true;
    };

    getAttriMap()
    {
        return this.#m_attris;
    };
};

module.exports = UActor;