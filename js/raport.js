window.onload = function() {
  var nume = decodeURIComponent(location.pathname.match(/\/([^\/]+).html$/)[1]),
      context = {
        procedură: top.opener.Formular.colectează(),
        executor: {}
      };

  top.opener.compile(context, this.document);
};
