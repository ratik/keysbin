'use strict';

function Routes($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('Home', {
            url: '/',
            controller: 'HomeCtrl as home',
            template: require('views/home.html'),
            title: 'KeysBin'
        })
        .state('Register', {
            url: '/register',
            controller: 'RegisterCtrl as register',
            template: 'register.html',
            title: 'Registration'
        })
        .state('Account', {
            url: '/account',
            controller: 'AccountCtrl',
            template: require('views/account.html'),
            title: 'Account'
        })
        .state('Account.Options', {
            url: '/account/options',
            controller: 'AccountOptionsCtrl as options',
            template: 'account_options.html',
            title: 'Account'
        });
    $urlRouterProvider.otherwise('/account');
}

module.exports = Routes;
