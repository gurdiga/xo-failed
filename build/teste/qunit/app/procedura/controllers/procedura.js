(function() {
  'use strict';

  var app = window.frames['app'];

  test('ControllerProcedura.totalSume(sume)', function() {
    var totalSume = app.App.module.C.ControllerProcedura.module.totalSume;

    var sume = [
      {suma: 2},
      {suma: 3.1},
      {suma: 4.9}
    ];

    var total = totalSume(sume);
    equal(total, 10, 'calculează total sume');

    sume.push({suma: 'non-număr'});
    total = totalSume(sume);
    equal(total, 10, 'ignoră valorile non-număr');

    sume.push({suma: '12.5'});
    total = totalSume(sume);
    equal(total, 22.5, 'converteşte corespunzător numerele string');
  });

})();
