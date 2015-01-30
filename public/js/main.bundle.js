webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(10);
	__webpack_require__(13);
	__webpack_require__(11);
	__webpack_require__(2);

	angular.element(document).ready(function() {
	    var requires = [
	        'ui.router',
	        'app.controllers'//,
	        // 'app.services',
	        // 'app.directives'
	    ];

	    window.app = angular.module('app', requires);
	    angular.module('app').constant('AppSettings', __webpack_require__(3));
	    angular.module('app').config(__webpack_require__(4));
	    angular.module('app').run(__webpack_require__(5));
	    angular.bootstrap(document, ['app']);


	});


/***/ },

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = angular.module('app.controllers', []);
	__webpack_require__(21);

/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var AppSettings = {
	  appTitle: 'KeysBin',
	  apiUrl: '/'
	};

	module.exports = AppSettings;

/***/ },

/***/ 4:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function Routes($stateProvider, $locationProvider, $urlRouterProvider) {
	    $locationProvider.html5Mode(true);
	    $stateProvider
	        .state('Home', {
	            url: '/',
	            controller: 'HomeCtrl as home',
	            template: __webpack_require__(69),
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
	}

	module.exports = Routes;


/***/ },

/***/ 5:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function OnRun($rootScope, AppSettings) {
	  // change page title based on state
	  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
	    $rootScope.pageTitle = '';

	    if ( toState.title ) {
	      $rootScope.pageTitle += toState.title;
	      $rootScope.pageTitle += ' \u2014 ';
	    }

	    $rootScope.pageTitle += AppSettings.appTitle;
	  });

	}

	module.exports = OnRun;

/***/ },

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html"

/***/ },

/***/ 11:
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 13:
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_crypto) {'use strict';

	var controllersModule = __webpack_require__(2);
	var base32 = __webpack_require__(22);
	var qr = __webpack_require__(19);

	controllersModule.controller('HomeCtrl', function($scope,$sce){
	    _crypto.randomBytes(64, function(err, data){
	        if(err) throw err;
	        $scope.rseed = data.toString('hex');
	    });
	    $scope.register = function(form){
	        if(!form.$valid){
	            return;
	        }
	        _crypto.pbkdf2($scope.rseed, $scope.signup.password, 2000, 16, function(err,code){
	            if (err) throw err;
	            $scope.code = base32.encode(code).toString().replace(/=/g,'');
	            var url = 'otpauth://totp/keysbin?secret='+$scope.code;
	            $scope.svg = $sce.trustAsHtml(qr.imageSync(url, {
	                type: 'svg'
	            }));
	            $scope.$digest();
	        });
	    }
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },

/***/ 69:
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div>\n    <div class=\"col-md-6\">\n        <h1>Login here</h1>\n        <form ng-submit=\"login()\" name=\"login_form\">\n            <div class=\"form-group\" ng-class=\"{'has-error': login_form.uid.$dirty && login_form.uid.$invalid}\">\n                <label for=\"InputEmail1\">Email address</label>\n                <input ng-model=\"uid\" ng-minlength=\"3\" type=\"email\" name=\"uid\" class=\"form-control\" id=\"InputEmail1\" placeholder=\"Enter email\">\n            </div>\n            <div class=\"form-group\">\n                <label for=\"InputPassword1\">Password</label>\n                <input ng-model=\"password\" ng-minlength=\"6\" type=\"password\" class=\"form-control\" id=\"InputPassword1\" placeholder=\"Password\">\n            </div>\n            <button type=\"submit\" class=\"btn btn-default\">Submit</button>\n        </form>\n    </div>\n    <div class=\"col-md-6\">\n        <h1>Or Register here</h1>\n        <form name=\"signup_form\" ng-submit=\"register(signup_form)\">\n            <div class=\"form-group\" ng-class=\"{'has-error': signup_form.uid.$dirty && signup_form.uid.$invalid}\">\n                <label for=\"InputEmail1\">Email address</label>\n                <input ng-model=\"signup.uid\" required type=\"email\" class=\"form-control\" id=\"InputEmail1\" name=\"uid\" placeholder=\"Enter email\">\n            </div>\n            <div class=\"form-group\" ng-class=\"{'has-error': signup_form.password.$dirty && signup_form.password.$invalid}\">\n                <label for=\"InputPassword1\">Password</label>\n                <input ng-model=\"signup.password\" name=\"password\" required ng-attr-type=\"{{show_password ? 'text' : 'password'}}\" class=\"form-control\" ng-minlength=\"6\" id=\"InputPassword1\" placeholder=\"Password\">\n            </div>\n            <div class=\"form-group\">\n                <label>\n                    <input type=\"checkbox\" ng-model=\"show_password\" value=\"1\" /> Show password\n                </label>\n            </div>\n            <button type=\"submit\" class=\"btn btn-default\">Register</button>\n        </form>\n        <br />\n        <div ng-show=\"code\">\n            <div class=\"col-md-6\">\n                <h5>Scan it with Google Authentificator or any other OTP app</h5>\n                <div ng-bind-html=\"svg\"></div>\n            </div>\n            <div class=\"col-md-6\">\n                <h5>Or enter Your OTP code manually: {{code}}</h5>\n            </div>\n        </div>\n    </div>\n    {{code}}\n</div>\n";

/***/ }

});