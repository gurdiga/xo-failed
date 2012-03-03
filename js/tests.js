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

  describe('$.fn.autoSizeTextareas', function() {
    var container = $('#autosize').autoSizeTextareas({
          selector: 'textarea',
          minHeight: 2
        }),
        textarea = container.find('textarea'),
        oneLineHeight = textarea.val('line1').trigger('change').height(),
        twoLineHeight = textarea.val('line1\rline2').trigger('change').height();

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
        template = $('.template.' + fieldset.data('template') + '.' + select.val());

    fieldset.initTypedFieldsets();
    select.click();

    test('a copy of the associated template content is inserted into the fieldset',
      fieldset.find('>.content').html() == template.html());
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
