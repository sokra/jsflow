var #;
var fs = require('fs');
{
	var #errHandler0 = function (#) {
		console.error(#);
	};
	fs.readFile(__filename, function (#err, #) {
		if (#err)
			return #errHandler0(#err);
		console.log(#);
	});
}
{
	var #errHandler1 = function (#) {
		console.error(#);
		throw #;
	};
	fs.readFile(__filename, function (#err, #) {
		if (#err)
			return #errHandler1(#err);
		console.log(#);
	});
}
try {
	# = fs.readFileSync(__filename);
	console.log(#);
} catch (#) {
	console.error(#);
}
try {
	var #errHandler2 = function (#) {
		console.error(#);
	};
	# = fs.readFileSync(__filename);
	fs.readFile(__filename, function (#err, #) {
		if (#err)
			return #errHandler2(#err);
		console.log(#);
	});
} catch (#) {
	#errHandler2(#);
}
{
	var #errHandler3 = function (#) {
		console.error('outer ' + #);
	};
	fs.readFile(__filename, function (#err, #) {
		if (#err)
			return #errHandler3(#err);
		{
			var #errHandler0 = function (#) {
				console.error('inner ' + #);
			};
			fs.readFile(__filename, function (#err, #) {
				if (#err)
					return #errHandler0(#err);
				console.log(#);
			});
		}
	});
}
{
	# = createErrorHandler;
	var #errHandler5 = #();
	try {
		# = fs.readFileSync(__filename);
		console.log(#);
	} catch (#) {
		#errHandler5(#);
	}
}
createErrorHandler(function (#) {
	var #errHandler6 = #;
	fs.readFile(__filename, function (#err, #) {
		if (#err)
			return #errHandler6(#err);
		console.log(#);
	});
});
try {
	var #errHandler9 = function (err) {
		console.error(err);
	};
	createErrorHandler(function (#) {
		var #errHandler9 = #;
		fs.readFile(__filename, function (#err, #) {
			if (#err)
				return #errHandler9(#err);
			console.log(#);
		});
	});
} catch (#) {
	var err = #;
	# = # && (#.stack || #.message) || 'error';
	console.error(#);
	throw err;
}