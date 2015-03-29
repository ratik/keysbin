var _model = require('./_model');
var util = require('util');
var ObjectID = require('mongodb').ObjectID;



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
    });
};

util.inherits(DataModel, _model);

DataModel.prototype.save = function(uid, key, parent, data, cb) {
    var self = this;
    data.parent = ObjectID(parent);
    data.uid = uid;
    if (!key) {
        self.col.insert(data, cb);
    } else {
        this.getOne(uid, key, function(err, one) {
            if (!one) {
                cb({
                    code: -101,
                    msg: 'permission denied'
                });
                return;
            }
            data._id = ObjectID(key);
            self.col.save(data, cb);
        });
    };
};

DataModel.prototype.get = function(uid, cb) {
    this.col.find({
        uid: ObjectID(uid)
    }, {fields:['crypted','top','parent']}).toArray(
        cb
    );
};

DataModel.prototype.getOne = function(uid, key, cb) {
    this.col.findOne({
        uid: ObjectID(uid),
        _id: ObjectID(key)
    }, cb);
};

DataModel.prototype.listKeys = function(uid, cb) {
    this.col.distinct('_id', {
        uid: uid
    }, cb);
};

DataModel.prototype.remove = function(uid, key, cb) {
    this.col.remove({
        uid: uid,
        _id: ObjectID(key)
    }, cb);
};


module.exports = DataModel;
