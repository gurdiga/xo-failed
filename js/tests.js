$(function() {

	// --------------------------------------------------

  describe('$.fn.hasHandler', function() {
    var element = $('#hasHandler'),
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
    var element = $('fieldset#hasHandler-delegated'),
        handler = function() {};

    element.on('click', 'legend', handler);

    test('returns true when handler found with selector',
      element.hasHandler('click', handler, 'legend') === true);
  });

	// --------------------------------------------------

  describe('$.fn.options', function() {
    var input = $('input#options');

    test('returns option by index if given', input.options(1) == 'b');

    var options = input.options();

    test('returns array with all the options if no index given',
       options[0] == 'a' &&
       options[1] == 'b' &&
       options[2] == 'c');
  });

	// --------------------------------------------------

  describe('$.fn.initOptionsUI', function() {
    stub($.fn, 'autocomplete');

    var input = $('input#initOptionsUI');

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

    test('inits autocomplete with $.initOptionsUI',
      $.fn.autocomplete.called);
    test('binds $.initOptionsUI.on.autocomplete.create',
      input.hasHandler('create', $.initOptionsUI.on.autocomplete.create));
    test('binds $.initOptionsUI.on.autocomplete.select',
      input.hasHandler('select', $.initOptionsUI.on.autocomplete.select));
    test('binds $.initOptionsUI.on.autocomplete.close',
      input.hasHandler('close', $.initOptionsUI.on.autocomplete.close));
    test('sets value to the fist option',
      input.val() == input.options(0));
  });

  describe('$.initOptionsUI.on.click', function() {
    var input = $('#initOptionsUI'),
        widget = $('#initOptionsUI-widget');

    stub($.fn, {
      name: 'autocomplete',
      args: ['widget'],
      returnValue: widget
     });

    widget.hide();
    $.initOptionsUI.on.click.call(input);

    test('opens up the options widget if not opened',
      $.fn.autocomplete.called &&
      equal($.fn.autocomplete.args, ['search', '']));

    widget.show();
    $.initOptionsUI.on.click.call(input);

    test('hides the options widget if opened',
      $.fn.autocomplete.called &&
      equal($.fn.autocomplete.args, ['close']));
  });

  describe('$.initOptionsUI.on.keypress', function() {
    test('$.initOptionsUI.on.keypress returns false',
      $.initOptionsUI.on.keypress() === false);
  });

  describe('$.initOptionsUI.on.focus', function() {
    stub($.fn, 'focus', 'blur');

    var input = $('input#initOptionsUI');

    $.initOptionsUI.on.focus.call(input);

    test('focuses the associated field if given',
       $.fn.focus.called &&
       $.fn.focus.selector == '#' + input.data('for'));

    var input = $('input#initOptionsUI-with-no-for');

    $.initOptionsUI.on.focus.call(input);

    test('blurs if no associated field given',
      $.fn.blur.called);
  });

  describe('$.initOptionsUI.on.autocomplete.create', function() {
    stub($.fn, 'autocomplete');
    stub($.fn, 'autoSize');

    var input = $('input#initOptionsUI');

    $.initOptionsUI.on.autocomplete.create.call(input);
    test('sets autocomplete options from the options data',
      $.fn.autocomplete.called &&
      $.fn.autocomplete.selector == input.selector &&
      equal($.fn.autocomplete.args, ['option', 'source', ['a', 'b', 'c']]));
    test('doesn’t init autoSize when doesn’t have class autosize',
      !$.fn.autoSize.called);

    input.addClass('autosize');
    $.initOptionsUI.on.autocomplete.create.call(input);
    test('inits autoSize when has class autosize',
      $.fn.autoSize.called,
      $.fn.autoSize.selector == input.selector);
  });

  describe('$.initOptionsUI.on.autocomplete.close', function() {
    var changeEventTriggered = false,
        input = $('input#initOptionsUI');

    input.on('change', function() {
      changeEventTriggered = true;
    });

    $.initOptionsUI.on.autocomplete.close.call(input);
    test('triggers the "change" event on input', changeEventTriggered);
  });

	// --------------------------------------------------

  describe('$.fn.initPanelsUI', function() {
    var panel = $('#initPanelsUI');

    panel.initPanelsUI();
    test('delegates $.initPanelsUI.on.closeButton.click to $.initPanelsUI.closeButtonSelector',
      panel.hasHandler('click', $.initPanelsUI.on.closeButton.click, $.initPanelsUI.closeButtonSelector));
  });

	// --------------------------------------------------

  describe('$.fn.autoSize()', function() {
    var input = $('#autoSize').autoSize();
        initialWidth = input.val('aa').trigger('change').width(),
        resizedWidth = input.val('a').trigger('change').width();

    test('"aa" > "a"', initialWidth > resizedWidth);
  });

	// --------------------------------------------------

  describe('$.fn.setCssFrom(element)', function() {
    var sourceElement = $('<span/>').css({
      'font-family': 'serif',
      'font-size': 'large',
      'text-align': 'right'
    })

    var element = $('<span/>');

    element.setCssFrom(sourceElement, ['font-family', 'text-align']);
    test('inherits those properties',
      element.css('font-family') == sourceElement.css('font-family') &&
      element.css('text-align') == sourceElement.css('text-align'));
  });

	// --------------------------------------------------

  describe('$.fn.initTypedFieldsets', function() {
    var fieldset = $('#initTypedFieldsets'),
        select = fieldset.find('legend select'),
        template = $('.template.' + fieldset.data('template') + '[title="' + select.val() + '"]');

    fieldset.initTypedFieldsets();
    select.click();

    test('a copy of the associated template content is inserted into the fieldset',
      fieldset.find('.content').html() == template.html());
  });
});

// --------------------------------------------------

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
