var #;
var fs = require('fs');
{
	var __jsflow__errHandler0 = function (__jsflow__) {
		throw __jsflow__;
	};
	fs.readFile(__filename, function (#err, #) {
		if (#err)
			return #errHandler0(#err);
		console.log(#);
	});
}
{
	var __jsflow__errHandler1 = function (__jsflow__) {
		throw __jsflow__;
	};
	fs.readFile('file.txt', 'utf-8', function (#err, #) {
		if (#err)
			return #errHandler1(#err);
		fs.readFile(#, function (#err, #) {
			if (#err)
				return #errHandler1(#err);
			console.log(#);
		});
	});
}