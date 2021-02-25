/*
 * @Author: your name
 * @Date: 2021-01-07 21:44:42
 * @LastEditTime: 2021-01-17 17:08:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Heaven\assets\Scripts\Game\Model\Core\debug\UDebug.js
 */

module.exports = {

    randHero(actor_id, ablitys = [], team = 1)
    {
        let uActor = uGS.ActorMgr.createActor(actor_id);

        let AT = uGS.AttriType;
        let attris = {};
        attris[AT.id] = actor_id;
        attris[AT.team] = team;
        attris[AT.speed] = uGS.tool.r2I(20, 50);
        attris[AT.attack] = 10;
        attris[AT.health] = 100;
        attris[AT.armor] = 5;
        attris[AT.mana] = 50;

        let attri_list = [];
        for (const key in attris) {
            let attri = uGS.ActorMgr.createAttri(key);
            attri.setValue(attris[key]);
            attri.setOrigin(uGS.OriginType.base);
            attri_list.push(attri);
        }

        uGS.ActorMgr.setAttris(actor_id, attri_list);
        // test
        uGS.ActorMgr.addAblitys(actor_id, ablitys);
        return uActor;   
    },

    randMonster(actor_id, ablitys = [], team = 2)
    {
        let uMonster = uGS.ActorMgr.createActor(actor_id);

        let AT = uGS.AttriType;
        let attris = {};
        attris[AT.id] = actor_id;
        attris[AT.team] = team;
        attris[AT.speed] = uGS.tool.r2I(60, 100);
        attris[AT.attack] = 30;
        attris[AT.health] = 450;
        attris[AT.armor] = 5;
        attris[AT.mana] = 50;

        let attri_list = [];
        for (const key in attris) {
            let attri = uGS.ActorMgr.createAttri(key);
            attri.setValue(attris[key]);
            attri.setOrigin(uGS.OriginType.base);
            attri_list.push(attri);
        }

        uGS.ActorMgr.setAttris(actor_id, attri_list);

        uGS.ActorMgr.addAblitys(actor_id, ablitys);

        return uMonster; 
    },

    testSkill()
    {
        // uGS.AbilityMgr.registerAbilityClass(1, 'CommonSkill');

        let uActor = uGS.ActorMgr.createActor(1);
        // uGS.ActorMgr.addAblitys(uActor, [1]);
        let ability = uGS.AbilityMgr.createAbility(1, 'BaseDamage');
        uActor.pushAbility(ability);
        uGS.Logic.cast_skill(1, 1, [1001]);
    },
};