window.init = function (context) {
  'use strict';

  var $întîrziere = context.buton.closest('.subsecţiune.întîrziere'),
      întîrziere = opener.Subsecţiuni.întîrzieri.colectează($întîrziere),
      calcule = opener.DobîndaDeÎntîrziere.calculează(întîrziere);

  context.întîrziere = întîrziere;
  context.detalii = calcule.detalii;
  context.întîrziere.dobînda = calcule.dobînda;

  window.Încheiere.modificat = function () { return true; };
};
