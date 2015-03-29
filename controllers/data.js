var dataModel = new(require('./../models/data.js'));
var userModel = new(require('./../models/user.js'));
var _controller = require('./_controller');
var validator = require('validator');
var openpgp = require('openpgp');

var util = require('util');


function DataController() {
    DataController.super_.call(this);
}

var checkSign = function(req, res) {
    if (!req.headers['x-sign']) {
        res.json({
            err: 6,
            msg: 'request is not signed'
        });
        return;
    }
}

util.inherits(DataController, _controller);

DataController.prototype.index = function(req, res, next) {
    switch (req.method) {
        case 'GET':
            if (!req.query.uid || !validator.isEmail(req.query.uid)) {
                res.json({
                    err: 1,
                    msg: 'uid wrong'
                });
                return;
            }
            if (!req.headers['x-sign']) {
                res.json({
                    err: 6,
                    msg: 'request is not signed'
                });
                return;
            }
            userModel.get(req.query.uid, function(err, user) {
                if (null !== err) {
                    res.json({
                        err: 1,
                        msg: 'uid wrong'
                    });
                    return;
                }
                openpgp.verifyClearSignedMessage(
                        openpgp.key.readArmored(user.pub).keys,
                        openpgp.cleartext.readArmored((new Buffer(req.headers['x-sign'], 'base64')).toString().trim())
                    )
                    .then(function(cleartextSig) {
                        if (!cleartextSig.signatures[0].valid) {
                            res.json({
                                err: 7,
                                msg: 'sign wrong'
                            });
                            return;
                        }
                        if (Math.abs(new Date().getTime() - cleartextSig.text) > 60 * 1000) {
                            res.json({
                                err: 8,
                                msg: 'expired sign'
                            });
                            return;
                        }
                        dataModel.get(user._id, function(err, out) {
                            if (err) {
                                res.json({
                                    err: 5,
                                    msg: err
                                });
                                return;
                            }
                            res.json({
                                ok: 1,
                                out: out
                            });
                        });
                    });
            });
            return;
            break;
        case 'PUT':
            if (!req.query.uid || !validator.isEmail(req.query.uid)) {
                res.json({
                    err: 1,
                    msg: 'uid wrong'
                });
                return;
            }
            userModel.get(req.query.uid, function(err, user) {
                if (null !== err) {
                    res.json({
                        err: 1,
                        msg: 'uid wrong'
                    });
                    return;
                }
                openpgp.verifyClearSignedMessage(
                        openpgp.key.readArmored(user.pub).keys,
                        openpgp.cleartext.readArmored(req.body.data)
                    )
                    .then(function(cleartextSig) {
                        if (!cleartextSig.text || !cleartextSig.signatures[0] || !cleartextSig.signatures[0].valid) {
                            res.json({
                                err: 7,
                                msg: 'sign wrong'
                            });
                            return;
                        }
                        dataModel.save(
                            user._id,
                            req.query._id == 'null' ? false : req.query._id,
                            req.query.parent, {
                                crypted: new Buffer(cleartextSig.text, 'base64').toString()
                            },
                            function(err, out) {
                                if (err) {
                                    res.json({
                                        err: 8,
                                        msg: err
                                    });
                                    return;
                                }
                                res.json({
                                    ok: 1,
                                    _id: 1 === out ? req.query._id : out[0]._id
                                });
                            }
                        );
                    })
                    .catch(function(err) {
                        res.json({
                            err: 1,
                            msg: err.toString()
                        });
                    });
            });
            return;
            break;
    }
    res.json({
        error: 1,
        msg: 'wrong method'
    });
}

module.exports = DataController;
