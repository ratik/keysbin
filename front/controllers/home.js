'use strict';

var controllersModule = require('./_index'),
    base32 = require('thirty-two'),
    qr = require('qr-image'),
    openpgp = require('openpgp');

openpgp.initWorker('js/openpgp.worker.min.js');

controllersModule.controller('HomeCtrl', function($scope, $sce, $http, userService, $timeout, $state) {
    $scope.login = function(form) {
        if (!form.$valid) {
            return;
        }
        $scope.logging = true;
        $timeout(function() {
            userService.login($scope.login.uid, $scope.login.password, $scope.login.otp)
                .then(function(data) {
                    $state.go('Account');
                })
                .catch(function(error) {
                    $scope.logging = false;
                    $scope.login_error = true;
                    $scope.login_error_msg = error.statusText;
                    $timeout(function() {
                        $scope.login_error = false;
                        $scope.login_error_msg = '';
                    }, 4000);
                });
        }, 10);
    }
    $scope.register = function(form) {
        $scope.saving = true;
        if (!form.$valid) {
            return;
        }
        $timeout(function() {
            userService.register($scope.signup.uid, $scope.signup.password)
                .then(function(data) {
                    $scope.saving = false;
                    $scope.hotp_key = data.hotp_key;
                    $scope.code = base32.encode($scope.hotp_key).toString().replace(/=/g, '');
                    //drawing QR code
                    $scope.svg = $sce.trustAsHtml(qr.imageSync('otpauth://totp/keysbin?secret=' + $scope.code, {
                        type: 'svg'
                    }));
                    $scope.$digest();
                })
                .catch(function(error) {
                    $scope.saving = false;
                    $scope.error = true;
                    $scope.error_msg = error.statusText;
                    $scope.$digest();
                    $timeout(function() {
                        $scope.error = false;
                        $scope.error_msg = '';
                    }, 4000);
                });
        }, 10);
    }
});
