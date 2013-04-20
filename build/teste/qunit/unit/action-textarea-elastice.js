(function () {
  'use strict';

  var app = window.frames['app'];

  test('TextareaElastice.evenimente', function () {
    equal(app.TextareaElastice.evenimente, 'keydown keyup input focus mouseup', 'avem evenimente');
  });


  test('TextareaElastice.init', function () {
    // stub
    app.TextareaElastice.autodimensioneazăOriginal = app.TextareaElastice.autodimensionează;

    var autodimensionat = false;

    app.TextareaElastice.autodimensionează = function () { autodimensionat = true; };

    app.TextareaElastice.init();
    equal(app.FormularProcedură.$.attr('spellcheck'), 'false', 'dezactivează verificarea gramaticii în formularul de procedură');

    app.FormularProcedură.$.find('textarea').first().trigger('input');
    ok(autodimensionat, 'leagă TextareaElastice.autodimensionează la evenimentul input');

    // unbind
    app.FormularProcedură.$.off(app.TextareaElastice.evenimente, app.TextareaElastice.autodimensionează);

    autodimensionat = false;
    app.FormularProcedură.$.find('textarea').first().trigger('input');
    ok(!autodimensionat, 'teardown: dezlegat TextareaElastice.autodimensionează la evenimentul input');

    // unstub
    app.TextareaElastice.autodimensionează = app.TextareaElastice.autodimensioneazăOriginal;
  });


  test('TextareaElastice.autodimensionează', function () {
    ok(app.TextareaElastice.autodimensionează, 'există');

    var textarea = $('<textarea></textarea>').appendTo(app.document.body);

    textarea.val('');
    equal(textarea.height(), 72, 'înălţimea iniţială, fără text, e 72px');

    textarea.val('un rînd');
    app.TextareaElastice.autodimensionează.call(textarea[0]);
    equal(textarea.height(), 72, 'cu o linie de text înălţimea se menţine la 72px');

    textarea.val('un rînd\ndouă rînduri\ntrei rînduri');
    app.TextareaElastice.autodimensionează.call(textarea[0]);
    equal(textarea.height(), 72, 'cu trei linii de text înălţimea se menţine la 72px');

    textarea.val('un rînd\ndouă rînduri\ntrei rînduri\npatru rînduri');
    app.TextareaElastice.autodimensionează.call(textarea[0]);
    ok(textarea.height() > 72, 'cu 4 linii de text înălţimea se măreşte');

    var înălţimeaCu4linii = textarea.height(),
        înălţimeaCu5linii;

    textarea.val('un rînd\ndouă rînduri\ntrei rînduri\npatru rînduri\ncinci rînduri');
    app.TextareaElastice.autodimensionează.call(textarea[0]);

    înălţimeaCu5linii = textarea.height();
    ok(înălţimeaCu5linii > înălţimeaCu4linii, 'înălţimea cu 5 linii e mai mare decît înălţimea cu 4 linii');

    textarea.val('un rînd\ndouă rînduri');
    app.TextareaElastice.autodimensionează.call(textarea[0]);
    equal(textarea.height(), 72, 'cînd are mai puţine linii se micşorează la loc');

    // teardwon
    textarea.remove();
  });

})();
