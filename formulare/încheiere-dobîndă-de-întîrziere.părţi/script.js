window.init = function (context) {
  'use strict';

  var $întîrziere = context.buton.closest('.subsecţiune.întîrziere');

  context.întîrziere = opener.Subsecţiuni.întîrzieri.colectează($întîrziere);
  context.întîrziere.dobînda = $întîrziere.find('.sumă.dobîndă').val();
};
