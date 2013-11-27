(function() {
  'use strict';

  var app = window.frames['app'];

  module('ControllerProcedura');

  test('totalSume(sume)', function() {
    var totalSume = app.App.module.C.ControllerProcedura.module.totalSume;

    var sume = [
      {suma: 2},
      {suma: 3.1},
      {suma: 4.9}
    ];

    var total = totalSume(sume);
    equal(total, 10, 'calculează total sume');

    total = totalSume([ {suma: 1}, {suma: 'non-număr'} ]);
    equal(total, 1, 'ignoră valorile non-număr');

    total = totalSume([ {suma: 1}, {suma: '12.5'} ]);
    equal(total, 13.5, 'converteşte corespunzător numerele string');
  });

})();
