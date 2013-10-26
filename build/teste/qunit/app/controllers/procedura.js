(function() {
  'use strict';

  var app = window.frames['app'];


  test('Procedura.totalSume(sume)', function() {
    var sume = [
      {suma: 2},
      {suma: 3.1},
      {suma: 4.9}
    ];

    var total = app.App.Controllers.Procedura.totalSume(sume);
    equal(total, 10, 'calculează total sume');

    sume.push({suma: 'non-număr'});
    total = app.App.Controllers.Procedura.totalSume(sume);
    equal(total, 10, 'ignoră valorile non-număr');

    sume.push({suma: '12.5'});
    total = app.App.Controllers.Procedura.totalSume(sume);
    equal(total, 22.5, 'converteşte corespunzător numerele string');
  });

})();
