/*
 * @Author: your name
 * @Date: 2021-01-02 13:37:26
 * @LastEditTime: 2021-01-08 20:39:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\Trigger\UTrigger.js
 */
class UTrigger {

    #m_nId = 0;
    #m_nCasterId = 0;
    #m_sType = 0;
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

    getMsg()
    {
        let data = {
            caster_id : this.#m_nCasterId,
            type : this.#m_sType,
            params : this.#m_oParams,
        };
        return data;
    };

    toLog()
    {
        var now = new Date();

        return '{' + now.getTime() + '} caster[' + this.#m_nCasterId + ']={' + this.#m_sType + ' ' + JSON.stringify(this.#m_oParams) + '}';
    };
};

module.exports = UTrigger;