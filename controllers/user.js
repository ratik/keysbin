var userModel = require('./../models/user.js').i();
var _controller = require('./_controller');
var util = require('util');
var validator = require('validator');



function UserController() {
    UserController.super_.call(this);
}
util.inherits(UserController, _controller.Controller);

UserController.prototype.index = function(req, res) {
    if (!req.query.uid || !validator.isEmail(req.query.uid)) {
        res.json({
            error: 1,
            msg: 'uid wrong'
        });
        return;
    }
    switch (req.method) {
        case 'GET':
            userModel.get(req.query.uid, function(err, one) {
                if (null !== err) {
                    res.json({
                        err: 2,
                        msg: 'get error'
                    });
                    return;
                }
                res.json({
                    ok: 1,
                    out: one
                });
            });
            return;
            break;
        case 'PUT':
            //TODO: verify private and public
            userModel.add(req.query.uid, req.query.priv, req.query.pub, function(err, one) {
                if (null === err) {
                    res.json({
                        err: 3,
                        msg: 'put error'
                    });
                    return;
                }
                res.json({
                    ok: 1,
                    out: one
                });
            });
            return;
            break;
    }
    res.end({
        error: 1,
        msg: 'wrong method'
    });
}


module.exports = {
    i: function() {
        return new UserController;
    },
    c: UserController
};
