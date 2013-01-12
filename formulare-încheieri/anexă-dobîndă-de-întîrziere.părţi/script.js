window.init = function (context) {
  /*jshint maxlen:130 */
  'use strict';

  var dinBaraDeSus = context.buton.parent().is(':not(.titlu)'),
      $întîrziere = dinBaraDeSus ? context.app.$('#calculator .întîrziere') : context.buton.closest('.subsecţiune.întîrziere'),
      întîrziere = context.app.Subsecţiuni.întîrzieri.colectează($întîrziere),
      calcule = context.app.DobîndaDeÎntîrziere.calculează(întîrziere);

  context.întîrziere = întîrziere;
  context.detalii = calcule.detalii;
  context.întîrziere.dobînda = calcule.dobînda;

  window.Încheiere.modificat = function () { return true; };
};
