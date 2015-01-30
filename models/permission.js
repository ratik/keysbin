var _model = require('./_model');
var util = require('util');

function PermissionModel() {
    PermissionModel.super_.call(this);
    this.on('open', function(err, db){
        if (err) {
            return;
        }
        this.col = db.collection('user_user_key');
        this.col.ensureIndex({uid:1}, function(err,iName){
            if (err) {
                throw err;
            }
        });
        this.col.ensureIndex({uid:1, uid2:1, key:1},{unique:true}, function(err,iName){
            if (err) {
                throw err;
            }
        });
    });
}

util.inherits(PermissionModel, _model.Model);

PermissionModel.prototype.add = function(uid, uid2, key, cb) {
    var self=this;
    this.get(uid, uid2, key, function(err, one) {
        if (one) {
            cb({code: -1, msg:'permission exists'});
            return;
        }
        self.col.insert({uid:uid,uid2:uid2,key:key}, cb);  
    });
}

PermissionModel.prototype.get = function(uid, uid2, key, cb) {
    this.col.findOne({uid:uid, uid2:uid2, key:key}, cb);
}

PermissionModel.prototype.listKeys = function(uid, uid2, cb) {
    this.col.distinct('key',{uid:uid, uid2:uid2},cb);
}

PermissionModel.prototype.listUsers = function(uid, cb) {
    this.col.distinct('uid2',{uid:uid},cb);
}

PermissionModel.prototype.remove = function(uid, uid2, key, cb){
    this.col.remove({uid:uid, uid2:uid2, key:key},cb);
}

module.exports = {
    i: function() {
        return new PermissionModel;
    },
    c: PermissionModel
};

