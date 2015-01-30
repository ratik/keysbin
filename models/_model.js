var config = require('./../config');
var MongoClient = require('mongodb').MongoClient;
var events = require("events");
var util = require("util");

function Model () {
    var self = this;
    Model.super_.call(this);
    MongoClient.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.db,
        function(err, db) {
            if (err) {
                self.emit('error', err);
                return;
            }
            self.db = db;
            self.emit('open', null, db);
        });
};

util.inherits(Model, events.EventEmitter);
Model.prototype._id = function(obj) {
    return JSON.stringify(obj);
};
exports.Model = Model;
