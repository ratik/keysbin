var express = require('express'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    _ = require('underscore'),
    connectDomain = require("connect-domain"),
    bodyParser = require('body-parser'),
    util = require('util');

app = express();

var controllers = {};

fs
    .readdirSync('./controllers')
    .filter(function(a) {
        return a[0] != '_';
    })
    .map(function(a) {
        return a.replace(/\.js$/, '')
    })
    .map(function(a) {
        controllers[a] = require('./controllers/' + a).i();
    });

app
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(connectDomain())
    .use(function(req, res, next) {
        var path = _.filter(req.path.split('/'));
        if (!_.isUndefined(controllers[path[0]])) {
            var controller = controllers[path[0]];
            var fn = 'index';
            if (!_.isUndefined(controller[path[1]])) {
                fn = path[1];
            }
            controller[fn](req, res);
        } else {
            next();
        }
    })
    .get("/", function(req, res) {
        res.sendFile(__dirname + '/public/index.html')
    })
    .use(express.static(__dirname + '/public'))
    .use(function(err, req, res, next) {
        res.writeHeader(500, {
            'Content-Type': "text/html"
        });
        res.write("<h1>" + err.name + "</h1>");
        res.end("<p style='border:1px dotted red'>" + err.message + "</p>");
    })
    .use(function(req, res) {
        res.writeHeader(404, {
            'Content-Type': "text/html"
        });
        res.end('404')
    });

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

// var models = [];

// fs
//     .readdirSync('./models')
//     .filter(function(a) {
//         return a[0] != '_';
//     })
//     .map(function(a) {
//         return a.replace(/\.js$/, '')
//     })
//     .map(function(a) {
//         models.push({
//             instance: require('./models/' + a).i(),
//             name: a
//         });
//     });

// models.map(function(model) {
//     model.urls = [];
//     Object.keys(model.instance.constructor.prototype).forEach(function(fnName) {
//         var strFn = model.instance.constructor.prototype[fnName].toString();
//         var m = strFn.match(/function[\s\t]\(([^\)]+)/);
//         var params = [];
//         if (m!==null) {
//                 m[1]
//                 .split(',')
//                 .map(function(a){return a.trim()})
//                 .map(function(a){
//                     if(['cb'].indexOf(a)==-1)
//                     params.push({method:'get','name':a});
//                 });
//         }
//         console.log(fnName);
//         console.log(params);

//         // var method = 'get';
//         // var posts = [];
//         // strFn.replace(/\/\/@([a-z]+)\: ([^\n\r\s\t]+)/g, function(m, k, v) {
//         //     console.log([m, k, v])
//         //     switch (k) {
//         //         case 'method':
//         //             method = v;
//         //             break;
//         //         case 'post':
//         //             posts.push(v);
//         //             break;
//         //         case 'noauth':

//         //     }
//         // });
//         // model.urls.push({
//         //     method: method
//         // });

//     });
//     return model;
// });


// console.log(models);
