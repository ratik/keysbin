angular.module('app',[
  'ui.router'
])
.config(function($stateProvider,$urlRouterProvider,$locationProvider){
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
            templateUrl: 'register.html',
            title: 'Registration'
        })
        .state('Account', {
            url: '/account',
            controller: 'AccountCtrl as account',
            templateUrl: 'account.html',
            title: 'Account'
        })
        .state('Account.Options', {
            url: '/account/options',
            controller: 'AccountOptionsCtrl as options',
            templateUrl: 'account_options.html',
            title: 'Account'
        });
    $urlRouterProvider.otherwise('/');
});