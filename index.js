var express = require('express'),
    favicon = require('serve-favicon'),
    fs = require('fs'),
    _ = require('underscore'),
    connectDomain = require("connect-domain"),
    bodyParser = require('body-parser'),
    util = require('util'),
    https = require('https');

var app = express();

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
        controllers[a] = new(require('./controllers/' + a));
    });

app
    .use(connectDomain())
    .use(bodyParser.json())
    .use(function(req, res, next) {
        var path = _.filter(req.path.split('/'));
        if ('api' === path.shift() && !_.isUndefined(controllers[path[0]])) {
            var controller = controllers[path[0]];
            var fn = 'index';
            if (!_.isUndefined(controller[path[1]])) {
                fn = path[1];
            }
            controller[fn](req, res, next);
        } else {
            next();
        }
    })
    .use(function(err, req, res, next) {
        console.log([err.line, err.name, err.message])
        res.writeHeader(500, {
            'Content-Type': "text/html"
        });
        res.write("<h1>" + err.name + "</h1>");
        res.end("<p style='border:1px dotted red'>" + err.message + "</p><pre>"+err.stack+'</pre>');
    })
    .use(function(req, res) {
        res.writeHeader(404, {
            'Content-Type': "text/html"
        });
        res.end('404')
    });

var server = app.listen(80, '127.0.0.1', function() {
    console.log('Listening on port %d', server.address().port);
});
