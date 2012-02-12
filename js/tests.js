$(function() {

	// --------------------------------------------------

  describe('$.fn.hasHandler', function() {
    var element = $('body'),
        handler = function() {};

    //element.on('click', handler);

    test('returns true when handler found',
      element.hasHandler('click', handler) === true);

    element.off();
  });

	// --------------------------------------------------

  describe('$.fn.options', function() {
    var input = $('input#plugin-options');

    test('returns option by index if given', input.options(1) == 'b');

    var options = input.options();

    test('returns array with all the options if no index given',
       options[0] == 'a' &&
       options[1] == 'b' &&
       options[2] == 'c');
  });

	// --------------------------------------------------

  describe('$.fn.initOptionsUI', function() {
    var input = $('input#plugin-initOptionsUI');

    input.initOptionsUI();

    test('adds "with options" clases',
      input.hasClass('with') && input.hasClass('options'));
    test('binds $.initOptionsUI.on.click',
      input.data('events')['click'][0].handler == $.initOptionsUI.on.click);
    test('binds $.initOptionsUI.on.keypress',
      input.data('events')['keypress'][0].handler == $.initOptionsUI.on.keypress);
    test('binds $.initOptionsUI.on.autocomplete.create',
      input.data('events')['autocomplete' + 'create'][0].handler == $.initOptionsUI.on.autocomplete.create);
    test('binds $.initOptionsUI.on.autocomplete.select',
      input.data('events')['autocomplete' + 'select'][0].handler == $.initOptionsUI.on.autocomplete.select);
    test('inits autocomplete',
      input.is('[aria-autocomplete="list"][aria-haspopup="true"]'));
  });

  describe('$.initOptionsUI.on.click', function() {
    // TODO
  });

});


$.fn.hasHandler = function(event, f, i) {
  var element = this,
      handlers = element.data('events')[event];

  console.log(handlers);
  if (!handlers) return false;

  if (i == undefined) {
    var found = false;

    $.each(handlers[event], function(i) {
      if (this[i].handler == f) {
        found = true;
        return false;
      }
    });

    return found;
  } else {
    return handlers[event][i].handler == f;
  }
};
