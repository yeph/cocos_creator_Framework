/*
 * @Author: jacklove
 * @Date: 2020-11-13 11:12:39
 * @LastEditTime: 2020-12-11 16:18:58
 * @LastEditors: jacklove
 * @Description: 
 * @FilePath: \TKGame\assets\Scripts\Frameworks\manager\dialog\DialogAction.js
 */

// import DialogDef from './DialogDef';
let DialogDef = require('./DialogDef')
let AniDef = DialogDef.DialogAnimation;

module.exports = {

    createAni(action_type, animation_type, ani_time, scale, callback)
    {
        if (action_type == 'open') {
            return this._createOpenAni(animation_type, ani_time, scale, callback);
        } else if (action_type == 'close') {
            return this._createCloseAni(animation_type, ani_time, scale, callback);
        }   

        return null;
    },

    _createOpenAni(animation_type, ani_time, scale, callback)
    {
        switch (animation_type) {
            case AniDef.no_animation : return this.open_noAction(ani_time, scale, callback);

            //-------------------------- normal --------------------------//
            case AniDef.scale_to_mid : return this.open_scaleAni(ani_time, scale, callback);
            case AniDef.left_to_right : return this.open_commonMoveAni(-2, 0, ani_time, scale, callback);
            case AniDef.right_to_left : return this.open_commonMoveAni(2, 0, ani_time, scale, callback);
            case AniDef.top_to_down : return this.open_commonMoveAni(0, 2, ani_time, scale, callback);
            case AniDef.down_to_top : return this.open_commonMoveAni(0, -2, ani_time, scale, callback);
            case AniDef.rotate_to_mid : return this.oc_rotateAni(0, scale, ani_time, scale, callback);
            case AniDef.fade_to_mid : return this.open_fadeAni(ani_time, scale, callback);

            //-------------------------- ease --------------------------//
            case AniDef.ease_scale_to_mid : return this.open_scaleAni(ani_time, scale, callback, true);
            case AniDef.ease_left_to_right : return this.open_commonMoveAni(-2, 0, ani_time, scale, callback, true);
            case AniDef.ease_right_to_left : return this.open_commonMoveAni(2, 0, ani_time, scale, callback, true);
            case AniDef.ease_top_to_down : return this.open_commonMoveAni(0, 2, ani_time, scale, callback, true);
            case AniDef.ease_down_to_top : return this.open_commonMoveAni(0, -2, ani_time, scale, callback, true);
            case AniDef.ease_rotate_to_mid : return this.oc_rotateAni(0, scale, ani_time, scale, callback, easing = true);
        
            default:
                break;
        }

        return this.open_noAction(ani_time, scale, callback);
    },

    _createCloseAni(animation_type, ani_time, scale, callback)
    {
        switch (animation_type) {
            case AniDef.no_animation : return this.close_noAction(ani_time, scale, callback);

            //-------------------------- normal --------------------------//
            case AniDef.scale_to_mid : return this.close_scaleAni(ani_time, scale, callback);
            case AniDef.left_to_right : return this.close_commonMoveAni(-2, 0, ani_time, scale, callback);
            case AniDef.right_to_left : return this.close_commonMoveAni(2, 0, ani_time, scale, callback);
            case AniDef.top_to_down : return this.close_commonMoveAni(0, 2, ani_time, scale, callback);
            case AniDef.down_to_top : return this.close_commonMoveAni(0, -2, ani_time, scale, callback);
            case AniDef.rotate_to_mid : return this.oc_rotateAni(scale, 0, ani_time, scale, callback);
            case AniDef.fade_to_mid : return this.close_fadeAni(ani_time, scale, callback);

            //-------------------------- ease --------------------------//
            case AniDef.ease_scale_to_mid : return this.close_scaleAni(ani_time, scale, callback, true);
            case AniDef.ease_left_to_right : return this.close_commonMoveAni(-2, 0, ani_time, scale, callback, true);
            case AniDef.ease_right_to_left : return this.close_commonMoveAni(2, 0, ani_time, scale, callback, true);
            case AniDef.ease_top_to_down : return this.close_commonMoveAni(0, 2, ani_time, scale, callback, true);
            case AniDef.ease_down_to_top : return this.close_commonMoveAni(0, -2, ani_time, scale, callback, true);
            case AniDef.ease_rotate_to_mid : return this.oc_rotateAni(scale, 0, ani_time, scale, callback, true);
        
            default:
                break;
        }

        return this.close_noAction(ani_time, scale, callback);
    },

    open_noAction(ani_time, scale, callback, easing = false)
    {
        var action = cc.callFunc((target) => {
            if (callback) { callback(); }
        });
        return action;
    },

    close_noAction(ani_time, scale, callback, easing = false)
    {
        var action = cc.callFunc((target) => {
            if (callback) { callback(target); }
        });
        return action;
    },

    open_scaleAni(ani_time, scale, callback, easing = false)
    {
        var action = cc.sequence(
            cc.callFunc((target) => {
                target.scale = 0;
            }),
            cc.scaleTo(ani_time, scale), 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );

        if (easing) { action.easing(cc.easeBackOut()); }
        
        return action;
    },

    close_scaleAni(ani_time, scale, callback, easing = false)
    {
        var action = cc.sequence(
            cc.scaleTo(ani_time, 0), 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );

        if (easing) { action.easing(cc.easeBackOut()); }

        return action;
    },

    open_commonMoveAni(scaleX, scaleY, ani_time, scale, callback, easing = false)
    {
        var move_action = cc.moveTo(ani_time, cc.v2(0, 0));
        if (easing) { move_action = move_action.easing(cc.easeBackOut()); }

        var action = cc.sequence(
            cc.place(cc.v2(scaleX * cc.winSize.width, scaleY * cc.winSize.height)), 
            move_action, 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );

        return action;
    },

    close_commonMoveAni(scaleX, scaleY, ani_time, scale, callback, easing = false)
    {
        var move_action = cc.moveTo(ani_time, cc.v2(scaleX * cc.winSize.width, scaleY * cc.winSize.height));
        if (easing) { move_action = move_action.easing(cc.easeBackOut()); }

        var action = cc.sequence(
            move_action, 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );

        if (easing) { action.easing(cc.easeBackOut()); }

        return action;
    },

    oc_rotateAni(scale_from, scale_to, ani_time, scale, callback, easing = false)
    {
        var action = cc.sequence(
            cc.callFunc((target) => {
                target.scale = scale_from;
            }),
            cc.spawn(
                cc.scaleTo(ani_time, scale_to), 
                cc.rotateBy(ani_time, 360 * 2)
            ), 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );

        return action;
    },

    open_fadeAni(ani_time, scale, callback, easing = false)
    {
        var action = cc.sequence(
            cc.callFunc((target) => {
                target.opacity = 0;
            }),
            cc.fadeIn(ani_time), 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );
        return action;
    },

    close_fadeAni(ani_time, scale, callback, easing = false)
    {
        var action = cc.sequence(
            cc.callFunc((target) => {
                target.opacity = 255;
            }),
            cc.fadeOut(ani_time), 
            cc.callFunc((target) => {
                if (callback) { callback(target); }
            })
        );
        return action;
    },
};