(function() {
    var qHint =
        window.jsHintTest =
        window.qHint =
            function qHint(name, sourceFile, options, globals) {
                if (sourceFile === undefined || typeof(sourceFile) == "object") {
                    // jsHintTest('file.js', [options])
                    globals = options;
                    options = sourceFile;
                    sourceFile = name;
                }

                qHint.sendRequest(sourceFile, function(req) {
                    start();
                    sourceFile = sourceFile.replace(/\?\d+$/, '');

                    if (req.status == 200) {
                        qHint.validateFile(req.responseText, options, globals, sourceFile);
                    } else {
                        ok(false, "HTTP error " + req.status +
                                  " while fetching " + sourceFile);
                    }
                });
            };

    qHint.validateFile = function (source, options, globals, sourceFile) {
        var i, len, er;

        if (JSHINT(source, options, globals)) {
            ok(true, sourceFile);
            return;
        }

        for (i = 0, len = JSHINT.errors.length; i < len; i++) {
            err = JSHINT.errors[i];
            if (!err) {
                continue;
            }

            ok(false, sourceFile + ': ' + err.reason +
                " on line " + err.line +
                ", character " + err.character);
        }
    };

    var XMLHttpFactories = [
        function () { return new XMLHttpRequest(); },
        function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
        function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
        function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
    ];

    function createXMLHTTPObject() {
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                return XMLHttpFactories[i]();
            } catch (e) {}
        }
        return false;
    }

    // modified version of XHR script by PPK
    // http://www.quirksmode.org/js/xmlhttp.html
    // attached to qHint to allow substitution / mocking
    qHint.sendRequest = function (url, callback) {
        var req = createXMLHTTPObject();
        if (!req) {
            return;
        }

        var method = "GET";
        req.open(method,url,true);
        req.onreadystatechange = function () {
            if (req.readyState != 4) {
                return;
            }

            callback(req);
        };

        if (req.readyState == 4) {
            return;
        }
        req.send();
    };
})();
