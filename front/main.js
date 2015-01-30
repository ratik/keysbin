'use strict';

require('index.html');
require('bootstrap_npm/css/bootstrap.min.css');
require('./style/main.css');
require('./controllers/_index');

angular.element(document).ready(function() {
    var requires = [
        'ui.router',
        'app.controllers'//,
        // 'app.services',
        // 'app.directives'
    ];

    window.app = angular.module('app', requires);
    angular.module('app').constant('AppSettings', require('./config'));
    angular.module('app').config(require('./routes'));
    angular.module('app').run(require('./on_run'));
    angular.bootstrap(document, ['app']);


});
