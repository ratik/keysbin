'use strict';
var _crypto = require('crypto-js');
var base32 = require('thirty-two');
var servicesModule = angular.module('app.services', []);

servicesModule.service('userService', function($http, $log, $q) {
    var publicKey = false;
    var privateKey = false;
    var user = false;
    var userServiceO = function() {};
    userServiceO.prototype = {
        'register': function(user, password) {
            var deferred = $q.defer();
            var rseed = _crypto.lib.WordArray.random(256).toString();
            var _password = _crypto.PBKDF2(
                password,
                rseed, {
                    keySize: 32,
                    iterations: 1000,
                    hasher: _crypto.algo.SHA3
                }
            ).toString();
            //preparing a second password for HOTP
            var hotp_key = _crypto.lib.WordArray.random(8).toString(); //to return
            //code for HOTP
            var code = base32.encode(hotp_key).toString().replace(/=/g, ''); // to return
            //generating keys
            return openpgp.generateKeyPair({
                numBits: 1024,
                userId: user,
                passphrase: _password
            }).then(function(key) {
                return $http
                    .put(
                        '/api/user', {
                            uid: user,
                            seed: rseed,
                            hotp: code,
                            priv: key.privateKeyArmored,
                            pub: key.publicKeyArmored
                        }
                    ).then(function(data) {
                        if (!data.data.ok) {
                            return $q.reject({
                                statusText: data.data.msg,
                                status: 500
                            });
                        }
                        //finally
                        return {
                            code: code,
                            hotp_key: hotp_key
                        };
                    });
            });
        },
        'login': function(_user, password, otp) {
            //get user
            return $http.get('/api/user?uid=' + _user + '&hotp=' + otp).then(function(data) {
                if (!data.data.ok) {
                    return $q.reject({
                        statusText: data.data.msg,
                        status: 500
                    });
                }
                return data.data.out;
            }).then(function(data) {
                //decrypt key
                privateKey = openpgp.key.readArmored(data.priv).keys[0];
                publicKey = openpgp.key.readArmored(data.pub).keys[0];
                var _password = _crypto.PBKDF2(
                    password,
                    data.seed, {
                        keySize: 32,
                        iterations: 1000,
                        hasher: _crypto.algo.SHA3
                    }
                ).toString();
                if (!privateKey.decrypt(_password)) {
                    return $q.reject({
                        statusText: 'Can\'t decrypt key - password is wrong',
                        status: 500
                    });
                }
                user = _user;
                return true;
            });
        },
        'sign': function(data) {
            return openpgp.signClearMessage(privateKey, data);
        },
        'load': function() {
            var deferred = $q.defer();
            openpgp.signClearMessage(privateKey, new Date().getTime().toString())
                .then(function(sign) {
                    $http({
                        'method': 'GET',
                        'headers': {
                            'X-Sign': btoa(sign)
                        },
                        'url': '/api/data?uid=' + user
                    }).then(function(data) {
                        if (!data.data.ok) {
                            $log.error(data.data.err)
                            deferred.reject({
                                statusText: data.data.msg,
                                status: 500
                            });
                        }
                        deferred.resolve(data.data.out);
                    }).catch(function(err) {
                        deferred.reject(err);
                    });
                });
            return deferred.promise;
        },
        'crypt': function(data) {
            return openpgp.encryptMessage(publicKey, data);
        },
        'decrypt': function(data) {
            return openpgp.decryptMessage(privateKey, openpgp.message.readArmored(data));
        },
        'save': function(data, fields) {
            var deferred = $q.defer();
            var _temp = {};
            angular.forEach(fields, function(o, i) {
                _temp[o] = data[o] ? data[o] : null;
            });
            _temp._md = new Date().getTime();
            openpgp.encryptMessage(publicKey, JSON.stringify(_temp))
                .then(function(crypted) {
                    return openpgp.signClearMessage(privateKey, new Buffer(crypted).toString('base64'));
                })
                .then(function(signed_and_crypted) {
                    $http
                        .put('/api/data?uid=' + user + '&_id=' + data._id + '&parent=' + data.parent, {
                            data: signed_and_crypted
                        })
                        .then(function(data) {
                            if (data.data.ok) {
                                deferred.resolve(data.data);
                            } else {
                                deferred.reject({
                                    statusText: data.data.msg,
                                    status: 500
                                });
                            }
                        })
                        .catch(deferred.reject)

                });
            return deferred.promise;
        },
        'delete': function(id) {

        }
    };
    return new userServiceO();
});


module.exports = servicesModule;
