var config = require('./../config');
var events = require("events");
var util = require("util");

function Controller() {
    var self = this;
    Controller.super_.call(this);
};

util.inherits(Controller, events.EventEmitter);

Controller.prototype.checkMethodIsAllowed = function(method, fnName) {
    return this.methodMap[fnName] ? this.methodMap[fnName].indexOf(method) !== -1 : false;
};

module.exports = Controller;
