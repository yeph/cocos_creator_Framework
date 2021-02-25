/*
 * @Author: jacklove
 * @Date: 2020-12-14 17:43:47
 * @LastEditTime: 2021-01-15 16:45:52
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Battle\Core\Formula.js
 */

module.exports = {

    // 伤害减护甲
    damage_function(damage, armor)
    {
        let final_damage = damage - armor;
        if (final_damage < 1) {
            final_damage = 1;
        }
        return Math.ceil(final_damage);
    },

    // 非线性计算
    damage_function2(damage, armor)
    {
        let final_damage = 1;
        if (armor >= 0) {
            final_damage = 1 / (1 + armor * 0.06) * damage;
        }
        else
        {
            final_damage = (2 - Math.pow(0.94, -armor)) * damage;
        }

        return Math.ceil(final_damage);
    },

    list_function(list, n)
    {
        if (n < 0) {
            return list[0];
        }

        if (n > list.length - 1) {
            return list[list.length - 1];
        }

        return list[n];
    },

    // 等比公式
    equal_ratio_function(base, ratio, n)
    {
        return base * Math.pow(ratio, n - 1);
    },

    // 等差公式
    equal_difference_function(base, ratio, n)
    {
        return base + ratio * (n - 1);
    },

    random_value(base, rand_max, rand_count_ex = 0)
    {
        let result = base;
        let rand_1 = uGS.tool.r2I(0, rand_max);
        result += rand_1;

        for (let i = 0; i < rand_count_ex; i++) {
            rand_1 = uGS.tool.r2I(0, rand_max);
            result += rand_1;
        }
        return result;
    },

};