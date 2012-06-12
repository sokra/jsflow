var #;
{
	var #errHandler0 = function (#) {
		throw #;
	};
	# = 2;
	var val = #;
	if (!#) {
		# = 1;
	}
	function doSth() {
		console.log();
	}
	while (#) {
		#--;
	}
	read(#, function (#err, #) {
		if (#err)
			return #errHandler0(#err);
		console.log(#);
	});
}