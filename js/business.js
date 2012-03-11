var Business = {
  init: function() {
    Cheltuieli.init();
  }
};

// --------------------------------------------------

var Cheltuieli = {
  init: function() {
    $('#procedură-nouă')
      .on('click', '#date-generale legend select', function() {
        if (this.value == 'pecuniar') {
        } else {
        }
      });
  }
};
