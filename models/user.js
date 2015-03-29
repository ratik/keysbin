var _model = require('./_model');
var util = require('util');
var ObjectID = require('mongodb').ObjectID;



function UserModel() {
    UserModel.super_.call(this);
    this.on('open', function(err, db) {
        if (err) {
            return;
        }
        this.col = db.collection('user');
        this.col.ensureIndex({
            uid: 1
        }, {
            unique: true
        }, function(err, iName) {
            if (err) {
                throw err;
            }
        });
    });
}

util.inherits(UserModel, _model);

UserModel.prototype.add = function(uid, seed, hotp, priv, pub, cb) {
    this.col.insert({
        uid: uid,
        seed: seed,
        hotp: hotp,
        pub: pub,
        priv: priv
    }, function(err, ok) {
        cb(err, ok);
    });
}

UserModel.prototype.get = function(uid, cb) {
    this.col.findOne({
            uid: uid
        }, {
            fields: ['uid', 'priv', 'seed', 'pub', 'hotp']
        },
        cb);
}

UserModel.prototype.geta = function() {
    this.col.findOne({
        uid: uid
    }, cb);
}

UserModel.prototype.remove = function(uid, cb) {
    //@method: delete
    this.col.remove({
        uid: uid
    }, cb);
}

module.exports = UserModel;
