(function() {
  'use strict';

  function Valute() {
    return {
      restrict: 'E',
      replace: true,

      scope: {
        suma: '='
      },

      controller: function($scope) {
        $scope.valute = (
          'MDL USD EUR AED ALL AMD AUD AZN BGN BYR CAD CHF CNY CZK DKK ' +
          'GBP GEL HKD HRK HUF ILS INR ISK JPY KGS KRW KWD KZT LTL LVL ' +
          'MKD MYR NOK NZD PLN RON RSD RUB SEK TJS TMT TRY UAH UZS XDR'
        ).split(' ');
      },

      templateUrl: 'directive-valute'
    };
  }


  window.App.directive('valute', Valute);

})();

