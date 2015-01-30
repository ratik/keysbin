
var dataModel = require('./../models/data.js').i();
var _controller = require('./_controller');
var util = require('util');


function DataController() {
    DataController.super_.call(this);
}

util.inherits(DataController, _controller.Controller);


DataController.prototype.methodMap = {
    'index':['get','put','delete'],
    'keys':['get']
}

DataController.prototype.index = function(req,res) {
    console.log([req]);
    res.end();
}


module.exports = {
    i: function() {
        return new DataController;
    },
    c: DataController
};


// module.exports = {
//     'keys': function(req, res) {
//         dataModel.listKeys(req.uid, function(err, out) {
//             if (err) {
//                 res.json(err);
//                 return;
//             }
//             res.json({
//                 success: 1,
//                 out: out
//             });
//         })
//     },
//     'add': function(req, res) {
//         dataModel.add(req.uid, req.key, req.data, function(err, out) {
//             if (err) {
//                 res.json(err);
//                 return;
//             }
//             res.json({
//                 success: 1,
//                 out: out
//             });
//         })
//     },
//     'getKeys': function(req, res) {
//         dataModel.getKeys(req.uid, function(err, out) {
//             if (err) {
//                 res.json(err);
//                 return;
//             }
//             res.json({
//                 success: 1,
//                 out: out
//             });
//         })
//     },
//     'remove': function(req, res) {
//         dataModel.remove(req.uid, req.key, function(err, out) {
//             if (err) {
//                 res.json(err);
//                 return;
//             }
//             res.json({
//                 success: 1,
//                 out: out
//             });
//         })
//     }
// }
