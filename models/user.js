var _model = require('./_model');
var util = require('util');
var crypto = require('crypto');


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

util.inherits(UserModel, _model.Model);

UserModel.prototype.add = function(uid, pub, priv, cb) {
    var self = this;
    this.get(uid, function(err, one) {
        if (one) {
            cb({
                code: -1,
                msg: 'user exists'
            });
            return;
        }
        self.col.insert({
            uid: uid,
            pub: pub,
            priv: priv,
            salt: crypto.pseudoRandomBytes(64).toString('hex')
        }, cb);
    });
}

UserModel.prototype.get = function(uid, cb) {
    this.col.findOne({
            uid: uid
        }, {
            fields: ['uid','priv','salt']
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

module.exports = {
    i: function() {
        return new UserModel;
    },
    c: UserModel
};
