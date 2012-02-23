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
    var autocompleteWidget = $('some selector');

    stub($.fn, {
      name: 'autocomplete',
      returnValue: autocompleteWidget
    }, 'setCssFrom');

    var input = $('input#initOptionsUI')[0];

    $.initOptionsUI.on.autocomplete.create.call(input);

    test('sets autocomplete options from the options data',
      $.fn.autocomplete.calls[0].context[0] == input &&
      equal($.fn.autocomplete.calls[0].args, ['option', 'source', ['a', 'b', 'c']]));

    test('make options text look like the input’s text',
      $.fn.setCssFrom.called &&
      $.fn.setCssFrom.selector == autocompleteWidget.selector + ' li a' &&
      equal($.fn.setCssFrom.args, [input, $.initOptionsUI.inheritedCss]));
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

  describe('$.fn.autosize with an input', function() {
    var input = $('#autosize input').autosize();

    test('adds handlers for keyup keydown blur update change',
      input.hasHandler('keypress', $.autosize.on['input:text']),
      input.hasHandler('update', $.autosize.on['input:text']),
      input.hasHandler('paste', $.autosize.on['input:text']),
      input.hasHandler('change', $.autosize.on['input:text']));
    test('"aa" > "a"',
      input.val('aa').trigger('change').width() >
      input.val('a').trigger('change').width());
    test('"ww" < "www"',
      input.val('ww').trigger('change').width() <
      input.val('www').trigger('change').width());
  });

  describe('$.fn.autosize with a textarea', function() {
    var textarea = $('#autosize textarea').autosize(),
        oneLineHeight = textarea.val('line1').trigger('change').height(),
        twoLineHeight = textarea.val('line1\rline2').trigger('change').height();

    test('adds handlers for keypress update paste change',
      textarea.hasHandler('keypress', $.autosize.on['textarea']),
      textarea.hasHandler('update', $.autosize.on['textarea']),
      textarea.hasHandler('paste', $.autosize.on['textarea']),
      textarea.hasHandler('change', $.autosize.on['textarea']));
    test('extends when multiple lines are added',
      oneLineHeight < twoLineHeight);

    oneLineHeight = textarea.val('line1').trigger('change').height();
    test('then shrinks back to fit content',
      oneLineHeight < twoLineHeight);
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

    element.setCssFrom('body', ['font-family', 'text-align']);
    test('inherits those properties: with selector as source',
      element.css('font-family') == $('body').css('font-family') &&
      element.css('text-align') == $('body').css('text-align'));

    element.setCssFrom(document.body, ['font-family', 'text-align']);
    test('inherits those properties: with DOM element as source',
      element.css('font-family') == $(document.body).css('font-family') &&
      element.css('text-align') == $(document.body).css('text-align'));
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

	// --------------------------------------------------

  describe('$.fn.makeExtensible', function() {
    var fieldset = $('#makeExtensible'), button;

    fieldset.makeExtensible();
    button = fieldset.find('select.extend');

    test('adds a button to add a new field from a list',
      button.length == 1);
    test('delegates $.makeExtensible.on.button.click on the button to the fieldset',
      $('fieldset').hasHandler('click', $.makeExtensible.on.button.click));
  });

  describe('$.makeExtensible.createId(label)', function() {
    var fieldset = $('#makeExtensible'),
        newLabel = $('<input class="label" value="New field"/>'),
        id = $.makeExtensible.createId(newLabel, fieldset);

    test('returns the slug of the label text + incremental number of taken',
      id == 'new-field-1'); // the fixture fieldset already contains a "new-field"
  });

  describe('$.makeExtensible.on.button.click', function() {
    stub($.fn, 'focus');

    var fieldset = $('#makeExtensible'), button;

    fieldset.makeExtensible();
    button = fieldset.find('select.extend');
    button.click();

    lastField = fieldset.find('li:last');

    test('focuses the aded input.label',
      $.fn.focus.called &&
      $.fn.focus.context[0] == lastField.find('.label')[0]);

    var newLabel = lastField.find('input.label'),
        newInput = lastField.find('input:not(.label)'),
        id = $.makeExtensible.createId(newLabel, fieldset);

    test('sets the label date-for', newLabel.data('for') == id);
    test('sets the input ID', newLabel.data('for') == id);
  });

  describe('$.makeExtensible.on["input.label"].click', function() {
    var label = $('#makeExtensible').find('input.label'),
        input = label.next(),
        newLabel = 'A new label',
        expectedNewId = 'a-new-label';

    label.val(newLabel);
    $.makeExtensible.on['input.label'].change.call(label);

    test('updates the label’s data-for', label.data('for') == expectedNewId);
    test('updates the input’s ID', input.attr('id') == expectedNewId);
  });

	// --------------------------------------------------

  describe('$.fn.initEditableLabels', function() {
    var fieldset = $('#initEditableLabels');

    fieldset.initEditableLabels();

    test('handles keypress on its input.labels',
      fieldset.hasHandler('keypress', $.initEditableLabels['input.label'].on.keypress));
  });

  describe('$.initEditableLabels["input.label"].on.keypress', function() {
    stub($.fn, 'focus');

    var fieldset = $('#initEditableLabels'),
        label = fieldset.find('input.label');

    $.initEditableLabels['input.label'].on.keypress.call(label, {which:13});

    test('on enter focuses .label’s associated field',
      $.fn.focus.called &&
      $.fn.focus.selector == '#' + label.data('for'));
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
