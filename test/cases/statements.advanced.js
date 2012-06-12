var #;
{
	# = sync();
	var a = #;
	a();
}
{
	var #errHandler0 = function (#) {
		throw #;
	};
	async(function (#err, #) {
		if (#err)
			return #errHandler0(#err);
		var a = #;
		a();
	});
}
try {
	error_sync();
} catch (#) {
	var a = #;
	a();
}
{
	var #errHandler1 = function (#) {
		var a = #;
		a();
	};
	error_async(function (#err, #) {
		if (#err)
			return #errHandler1(#err);
		#;
	});
}
{
	# = ignore();
	console.log(#);
	var a = #;
	a();
}
{
	var #errHandler2 = function (#) {
		throw #;
	};
	custom(function (x, #, y, #err) {
		if (#err)
			return #errHandler2(#err);
		var a = #;
		a();
	});
}