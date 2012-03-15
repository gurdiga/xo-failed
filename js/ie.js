var IE = {
  init: function() {
    this.fixSelectWidthBug();
  },

  fixSelectWidthBug: function() {
    $('#date-generale').on('mouseover', '#obiect', function() {
      var select = $(this),
          clon,
          WITHOUT_EVENTS = false;

      clon = select.clone(WITHOUT_EVENTS)
        .css({
          'width': 'auto',
          'position': 'absolute'
        })
        .removeAttr('id')
        .removeAttr('title')
        .val(select.val())
        .insertBefore(select)
        .on('change', function() {
          select
            .val(clon.val())
            .trigger('change');
          ştergeClon();
        })
        .on('click', function() {
          $(this).toggleClass('opened');
        })
        .on('blur', ştergeClon)
        .on('mouseout', function(e) {
          if (clon.is(':not(.opened)')) ştergeClon();
        });

      function ştergeClon() {
        clon.remove();
        select.css('visibility', 'visible');
      }

      select.css('visibility', 'hidden');
    });
  }
};

IE.init();
