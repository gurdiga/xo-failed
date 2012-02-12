/*
	We need this markup:

	<p id="output"></p>
	<p>
		<span id="total-tests">0</span> tests run,
		<span id="failed-tests">0</span> failures.
	</p>

	<ul id="failures">
	</ul>

*/
var context = {
	description: '',
	stubbedNamespaces: []
};


function test(description, value) {
	if (arguments.length == 1) {
		say('*', '*' + context.description + ': ' + description);
	} else if (!value) {
		say('F', context.description + ': ' + description);
	} else {
		say('.');
	}
}


function describe(description, closure) {
	context.description = description;
	context.stubbedNamespaces = [];

	try {
		closure();
	} catch (e) {
		say('E', context.description + ': ' + e);
	}

	for (var i = 0; i < context.stubbedNamespaces.length; i++) {
		unstub(context.stubbedNamespaces[i]);
	}
}

function say(status, message) {
	var totalTests = document.getElementById('total-tests'),
			failedTests = document.getElementById('failed-tests'),
			failures = document.getElementById('failures'),
			output = document.getElementById('output');

	totalTests.innerHTML++;
	output.innerHTML += status;

	if (status != '.') {
		failedTests.innerHTML++;
		failures.innerHTML += '<li>' + message + '</li>';
	}
}

function stub() {
	var namespace = Array.prototype.shift.apply(arguments),
			functionNames = arguments,
			originals = [],
			name, returnValue, i, j, f;

	for (i = 0; i < functionNames.length; i++) {
		f = functionNames[i];

		if (typeof f == "string") {
			f = {
				name: f,
				args: null,
				returnValue: null
			};
		}

		originals[f.name] = namespace[f.name];
		namespace[f.name] = newStub(f.args, f.returnValue);
	}

	namespace.stubbedFunctions = originals;
	context.stubbedNamespaces.push(namespace);

	function newStub(args, returnValue) {
		var f = function() {
			var argsAsExpected = true;

			if (f.expectedArgs) {
				for (var i = 0; i < f.expectedArgs.length; i++) {
					if (f.expectedArgs[i] != arguments[i]) {
						argsAsExpected = false;
						break;
					}
				}
			}

			f.called = true;
			f.args = arguments;

			if (this.jquery) {
				f.selector = this.selector;
				f.context = this;
				returnValue = returnValue || this;
			}

			f.calls[f.calls.length] = {
				args: f.args,
				selector: f.selector,
				context: f.context
			};

			return returnValue;
		};

		f.called = false;
		f.calls = [];
		f.expectedArgs = args;

		return f;
	}

};

function unstub() {
	var namespaces = Array.prototype.slice.apply(arguments);

	for (var i = 0; i < namespaces.length; i++) {
		namespace = namespaces[i];

		for (var name in namespace.stubbedFunctions) {
			namespace[name] = namespace.stubbedFunctions[name];
		}

    try {
      delete namespace.stubbedFunctions;
    } catch(e) { // IE hack. http://perfectionkills.com/understanding-delete/#ie_bugs
      namespace.stubbedFunctions = undefined;
    }
	}
}
