window.onload = function() {
  var nume = decodeURIComponent(location.pathname.match(/\/([^\/]+).html$/)[1]);

  top.opener.compile(top.opener.Rapoarte[nume].date(), this.document);
};
