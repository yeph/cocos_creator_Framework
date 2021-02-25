/*
 * @Author: your name
 * @Date: 2020-12-14 23:30:18
 * @LastEditTime: 2020-12-15 17:16:30
 * @LastEditors: jacklove
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\Action\UAction.js
 */

class UAction {

    #m_nId = 0;
    #m_nCasterId = 0;
    #m_sType = '';
    #m_oParams = new Object();

    constructor(id)
    {
        // this.#m_nId = id;
    };

    getId() { return this.#m_nId; };

    setCasterId(id) { this.#m_nCasterId = id; };

    getCasterId() { return this.#m_nCasterId; };

    setType(type) { this.#m_sType = type; };

    getType() { return this.#m_sType; };

    setParams(params) { this.#m_oParams = params; };

    getParams() { return this.#m_oParams; };

    toLog()
    {
        var now = new Date();

        return '{' + now.toLocaleString() + '} caster[' + this.#m_nCasterId + ']={' + this.#m_sType + ' ' + JSON.stringify(this.#m_oParams) + '}';
    };
};

module.exports = UAction;