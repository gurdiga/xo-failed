$(function() {

	// --------------------------------------------------

  describe('$.fn.hasHandler', function() {
    var element = $('#plugin-hasHandler'),
        handler = function() {},
        anotherHandler = function() {};

    test('returns false with no handlers at all',
      element.hasHandler('click', handler) === false);

    element.on('click', handler);

    test('returns true when handler found',
      element.hasHandler('click', handler) === true);
    test('returns false when handler not found',
      element.hasHandler('click', anotherHandler) === false);
  });

  describe('$.fn.hasHandler delegated', function() {
    var element = $('fieldset#plugin-hasHandler-delegated'),
        handler = function() {};

    element.on('click', 'legend', handler);

    test('returns true when handler found with selector',
      element.hasHandler('click', handler, 'legend') === true);
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
    test('turns spellcheck off',
      input.is('[spellcheck=false]'));

    test('binds $.initOptionsUI.on.click',
      input.hasHandler('click', $.initOptionsUI.on.click));
    test('binds $.initOptionsUI.on.focus',
      input.hasHandler('focus', $.initOptionsUI.on.focus));
    test('binds $.initOptionsUI.on.keypress',
      input.hasHandler('keypress', $.initOptionsUI.on.keypress));

    test('inits autocomplete',
      input.is('[aria-autocomplete="list"][aria-haspopup="true"]'));
    test('binds $.initOptionsUI.on.autocomplete.create',
      input.hasHandler('create', $.initOptionsUI.on.autocomplete.create));
    test('binds $.initOptionsUI.on.autocomplete.select',
      input.hasHandler('select', $.initOptionsUI.on.autocomplete.select));
    test('sets autocomplete autoFocus',
      input.autocomplete('option', 'autoFocus') == $.initOptionsUI.autocomplete.autoFocus);
    test('sets autocomplete delay',
      input.autocomplete('option', 'delay') == $.initOptionsUI.autocomplete.delay);
    test('sets value to the fist option',
      input.val() == input.options(0));
  });

  describe('$.initOptionsUI.on.click', function() {
    stub($.fn, 'autocomplete');

    $.initOptionsUI.on.click();

    test('$.initOptionsUI.on.click opens the options popup',
      $.fn.autocomplete.called &&
      $.fn.autocomplete.args[0] == 'search' &&
      $.fn.autocomplete.args[1] == '');
  });

  describe('$.initOptionsUI.on.keypress', function() {
    test('$.initOptionsUI.on.keypress returns false',
      $.initOptionsUI.on.keypress() === false);
  });

  describe('$.initOptionsUI.on.focus', function() {
    stub($.fn, 'focus', 'blur');

    var input = $('input#plugin-initOptionsUI');

    $.initOptionsUI.on.focus.call(input);

    test('focuses the associated field if given',
       $.fn.focus.called &&
       $.fn.focus.selector == '#' + input.data('for'));

    var input = $('input#plugin-initOptionsUI-with-no-for');

    $.initOptionsUI.on.focus.call(input);

    test('blurs if no associated field given',
      $.fn.blur.called);
  });

  describe('$.initOptionsUI.on.autocomplete.create', function() {
    var input = $('input#plugin-initOptionsUI');

    $.initOptionsUI.on.autocomplete.create.call(input);
    test('sets autocomplete options from the options data',
      input.autocomplete('option', 'source')[0] == 'a' &&
      input.autocomplete('option', 'source')[1] == 'b' &&
      input.autocomplete('option', 'source')[2] == 'c');
  });

	// --------------------------------------------------

  describe('$.fn.initFieldsetsUI', function() {
    var fieldset = $('fieldset#plugin-initFieldsetsUI');

    fieldset.initFieldsetsUI();
    test('binds $.initFieldsetsUI.on.legend.click',
      fieldset.hasHandler('click', $.initFieldsetsUI.on.legend.click));
  });

  describe('$.initFieldsetsUI.on.legend.click', function() {
    var fieldset = $('fieldset#plugin-initFieldsetsUI');

    $.initFieldsetsUI.on.legend.click.call(fieldset);
    test('collapses the fieldset on one click',
      fieldset.is('.collapsed'));

    $.initFieldsetsUI.on.legend.click.call(fieldset);
    test('expands the fieldset on the next cick',
      fieldset.is(':not(.collapsed)'));
  });

	// --------------------------------------------------

  describe('$.fn.initPanelsUI', function() {
    var panel = $('#plugin-initPanelsUI');

    panel.initPanelsUI();
    test('delegates $.initPanelsUI.on.closeButton.click to $.initPanelsUI.closeButtonSelector',
      panel.hasHandler('click', $.initPanelsUI.on.closeButton.click, $.initPanelsUI.closeButtonSelector));
  });
});


$.fn.hasHandler = function(event, f, selector) {
  var element = this,
      handlers = element.data('events'),
      found = false;


  if (!handlers) return false;

  $.each(handlers[event], function() {
    if (selector) {
      if (this.handler == f && this.selector == selector) {
        found = true;
        return false; // break $.each
      }
    } else {
      if (this.handler == f) {
        found = true;
        return false; // break $.each
      }
    }
  });

  return found;
};
