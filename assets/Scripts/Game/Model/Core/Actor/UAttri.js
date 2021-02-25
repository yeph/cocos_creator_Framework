/*
 * @Author: your name
 * @Date: 2021-01-14 16:11:09
 * @LastEditTime: 2021-01-17 13:52:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\Actor\UAttri.js
 */

class UAttri {

    #m_name = '';
    #m_origin = '';
    #m_value = 0;
    #m_data = new Object();    // 其他参数

    constructor(name)
    {
        this.#m_name = name;
    };

    getName() { return this.#m_name; }

    setOrigin(origin) { this.#m_origin = origin; }
    getOrigin() { return this.#m_origin; }

    setValue(value) { this.#m_value = value; }
    getValue() { return this.#m_value; }

    // 添加参数
    setData(key, value)
    {
        this.#m_data[key] = value;
    };

    // 获得参数
    getData(key, value)
    {
        if (this.#m_data.hasOwnProperty(key)) {
            return this.#m_data[key];
        }
        return value;
    };
};

module.exports = UAttri;