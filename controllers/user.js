var userModel = new(require('./../models/user.js'));
var dataModel = new(require('./../models/data.js'));
var _controller = require('./_controller');
var util = require('util');
var validator = require('validator');
var notp = require('notp');
var base32 = require('thirty-two');



function UserController() {
    UserController.super_.call(this);
}
util.inherits(UserController, _controller);

UserController.prototype.index = function(req, res, next) {
    switch (req.method) {
        case 'GET':
            if (!req.query.uid || !validator.isEmail(req.query.uid)) {
                res.json({
                    error: 1,
                    msg: 'Uid wrong'
                });
                return;
            }
            userModel.get(req.query.uid, function(err, one) {
                if (null !== err) {
                    res.json({
                        err: 2,
                        msg: 'Get error'
                    });
                    return;
                }
                console.log(one)
                if (null === one) {
                    res.json({
                        err:2,
                        msg:'No such user'
                    });
                    return;
                }
                if (1 || notp.totp.verify(req.query.otp, base32.decode(one.hotp))) { //TODO:remove
                    delete one.hotp;
                    res.json({
                        ok: 1,
                        out: one
                    });
                    return;
                }
                res.json({
                    error: 4,
                    msg: 'One time password is wrong'
                });
            });
            return;
            break;
        case 'PUT':
            //TODO: add validation
            userModel.add(req.body.uid, req.body.seed, req.body.hotp, req.body.priv, req.body.pub, function(err, one) {
                if (err !== null) {
                    if (err.code === 11000) {
                        res.json({
                            err: 4,
                            msg: 'User already exists'
                        });
                        return;
                    }
                    res.json({
                        err: 3,
                        msg: 'put error'
                    });
                } else {
                    if (one === null) {
                        res.json({
                            err: 4,
                            msg: 'User already exists'
                        });
                    } else {     
                        one=one.pop();
                        res.json({
                            ok: 1,
                            out: one
                        });
                        dataModel.save(one._id,false,{top:true},function(){});
                    }
                }
            });
            return;
            break;
    }
    res.json({
        error: 1,
        msg: 'wrong method'
    });
}


module.exports = UserController;
