var _model = require('./_model');
var util = require('util');

function DataModel() {
    DataModel.super_.call(this);
    this.on('open', function(err, db) {
        if (err) {
            return;
        }
        this.col = db.collection('user_key');
        this.col.ensureIndex({
            uid: 1
        }, function(err, iName) {
            if (err) {
                throw err;
            }
        });
        this.col.ensureIndex({
            uid: 1,
            key: 1
        }, {
            unique: true
        }, function(err, iName) {
            if (err) {
                throw err;
            }
        });
    });
};

util.inherits(DataModel, _model.Model);

DataModel.prototype.add = function(uid, key, data, cb) {
    //@method: put
    //@post: data
    var self = this;
    this.get(uid, key, function(err, one) {
        if (one) {
            cb({
                code: -101,
                msg: 'key exists'
            });
            return;
        }
        self.col.insert({
            uid: uid,
            key: key,
            data: data
        }, cb);
    });
};

DataModel.prototype.get = function(uid, key, cb) {
    this.col.findOne({
        uid: uid,
        key: key
    }, {
        fields: ['data']
    }, cb);
};

DataModel.prototype.listKeys = function(uid, cb) {
    this.col.distinct('key', {
        uid: uid
    }, cb);
};

DataModel.prototype.remove = function(uid, key, cb) {
    this.col.remove({
        uid: uid,
        key: key
    }, cb);
};

module.exports = {
    i: function() {
        return new DataModel;
    },
    c: DataModel
};
