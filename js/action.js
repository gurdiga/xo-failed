$(function() {

  $('fieldset').each(function() {
    var fieldset = $(this);

    fieldset.find('legend')
      .on('click', function() {
        fieldset
          .toggleClass('collapsed')
          .find('.content').toggle();
      });
  });

  $('.label[data-options]').initOptionsUI();


  $('button#new-file').button({
    icons: {
      primary: 'ui-icon-circle-plus'
    }
  }).click(function() {
    $('#new-file-panel').show();
  });

  $('button.close-panel').on('click', function() {
    $(this).closest('.panel').hide();
  });
});

// --------------------------------------------------

$.fn.options = function(index) {
  var options = this.filter('[data-options]').data('options').split('|');

  return index === undefined ? options : options[index];
};

// --------------------------------------------------

$.initOptionsUI = {
  on: {
    keypress: function() {
      return false;
    },

    click: function() {
      $(this).autocomplete('search', '');
    },

    autocomplete: {
      create: function() {
        $(this).autocomplete('option', 'source', $(this).options());
      },

      select: function() {
        var associatedFieldId = $(this).data('for');

        $('#' + associatedFieldId).focus();
      }
    }
  }
};

$.fn.initOptionsUI = function() {
  return this.filter('input[data-options]').each(function() {
    var input = $(this);

    input
      .addClass('with options')
      .autocomplete({
        autoFocus: true,
        delay: 0,
        minLength: 0,
        create: $.initOptionsUI.on.autocomplete.create,
        select: $.initOptionsUI.on.autocomplete.select
      })
      .val(function() {
        return $(this).options(0);
      });

    $.each($.initOptionsUI.on, function(event, handler) {
      if ($.isFunction(handler)) {
        input.on(event, handler);
      } else {
        $.each(handler, function(event, handler) {
          input.on(event, handler);
        });
      }
    });
  });
};

// http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
