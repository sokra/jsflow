var #;
var fs = require('fs');
{
	var #errHandler0 = function (#) {
		throw #;
	};
	fs.readdir(__dirname, function (#err, #) {
		if (#err)
			return #errHandler0(#err);
		#.forEach(function (#) {
			var path = #;
			fs.readFile(#, 'utf-8', function (#err, #) {
				if (#err)
					return #errHandler0(#err);
				console.log(path + ': ' + #);
			});
		});
	});
}
test(function (a, b, c) {
	console.log(a + b + c);
});