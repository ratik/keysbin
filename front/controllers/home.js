'use strict';

var controllersModule = require('./_index');
var base32 = require('thirty-two');
var qr = require('qr-image');

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
