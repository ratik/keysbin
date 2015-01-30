'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function OptionsCtrl() {
/*
  // ViewModel
  var vm = this;

  vm.title = 'AngularJS, Gulp, and Browserify!';
  vm.number = 1234;
/**/
}

controllersModule.controller('OptionsCtrl', OptionsCtrl);