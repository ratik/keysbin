'use strict';

var controllersModule = require('./_index'),
    base32 = require('thirty-two'),
    qr = require('qr-image'),
    openpgp = require('openpgp'),
    _crypto = require('crypto-js'),
    async = require('async');

controllersModule.requires.push('angularBootstrapNavTree');
require('angular-bootstrap-nav-tree/dist/abn_tree_directive.js');
require('angular-bootstrap-nav-tree/dist/abn_tree.css');
openpgp.initWorker('js/openpgp.worker.min.js');

controllersModule.controller('AccountCtrl', function($scope, $http, $rootScope, userService) {
    $scope.fields = ['label', 'login', 'url', 'password', 'comment'];
    $scope.current_node = {};
    $scope.saving = false;
    $scope.error = false;
    $scope.message = false;
    $scope.show_message = function(msg, error, cb) {
        if (error) {
            $scope.error = true;
        }
        $scope.message = msg;
        $timeout(function() {
            $scope.message = false;
            $scope.error = false;
            if (typeof(cb) === 'function') {
                cb();
            }
        }, 4000);
    };
    $scope.my_tree_handler = function(branch) {
        $scope.current_node_ptr = branch;
        var temp = {};
        $scope.fields.map(function(field) {
            if (branch[field])
                temp[field] = branch[field];
        });
        $scope.current_node = temp;
    };
    //load and preprocess data
    userService
        .load()
        .then(function(data) {
            var _top = null;
            var _by_parent = {};
            angular.forEach(data, function(o, i) {
                if (o.top) {
                    o.children = [];
                    _top = o;
                } else {
                    if (!_by_parent[o.parent]) {
                        _by_parent[o.parent] = [];
                    }
                    _by_parent[o.parent].push(o);
                }
            });
            var _find_children = function(o) {
                if (_by_parent[o._id]) {
                    o.children = _by_parent[o._id];
                    o.children.map(_find_children);
                }
            };
            _find_children(_top);
            //decrypt all the loaded data async
            async.mapSeries(
                data,
                function(item, cb) {
                    if (!item.crypted) {
                        cb(null, null);
                        return;
                    }
                    userService
                        .decrypt(item.crypted)
                        .then(function(decrypted) {
                            angular.forEach(angular.fromJson(decrypted), function(o, i) {
                                item[i] = o;
                            });
                            cb(null, true);
                        })
                        .catch(function(err) {
                            cb(err, null);
                        });
                },
                function(err, done) {
                    if (err) {
                        $scope.show_message(err, true);
                        return;
                    }
                    $scope.$digest();
                });
            //
            $scope.tree_data = _top;
        })
        .catch(function(err) {
            $scope.show_message(err, true);
        });
    // $scope.my_data = treedata_avm;
    $scope.tree_data = {
        children: []
    };
    $scope.data_tree = {};
    $scope.current_node_ptr = null;
    $scope.comment_rows = function() {
        return ($scope.current_node.comment + '\n').match(/\n/gi).length + 1
    };
    $scope.add_child = function() {
        var _current = $scope.data_tree.get_selected_branch();
        $scope.data_tree.add_branch(_current, {
            label: 'New item',
            parent: _current._id,
            _id: null
        });
    };
    $scope.add_child_top = function() {
        $scope.data_tree.add_branch(null, {
            label: 'New item',
            _id: null,
            parent: $scope.tree_data._id
        });
    };
    $scope.delete_child = function() {
        var current = $scope.data_tree.get_selected_branch();
        if (current && confirm('Are you sure?')) {
            var parent = $scope.data_tree.get_parent_branch(current);
            angular.forEach(parent.children, function(o, i) {
                if (o.uid === current.uid) {
                    parent.children.splice(i, 1);
                }
            });
            $scope.data_tree.select_branch(parent);
        }
    };
    $scope.save = function() {
        $scope.fields.map(function(field) {
            $scope.current_node_ptr[field] = $scope.current_node[field];
        });
        $scope.saving = true;
        userService.save($scope.current_node_ptr, $scope.fields).then(function(out) {
                $scope.current_node_ptr._id = out._id;
                $scope.saving = false;
                $scope.show_message('Saved', false);
            })
            .catch(function(err) {
                $scope.show_message(err, true);
                $scope.saving = false;
            });
    };
});
