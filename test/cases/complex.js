var #;
try {
	# = a();
	var #errHandler1 = #();
	b(function (#err, #) {
		if (#err)
			return #errHandler1(#err);
		var c = #;
		#.forEach(function (#) {
			var d = #;
			c.d(function (#err, #) {
				if (#err)
					return #errHandler1(#err);
				return function () {
					{
						var #errHandler0 = function (#) {
							e(#);
						};
						b(function (#err, #) {
							if (#err)
								return #errHandler0(#err);
							var a = #;
							{
								# = a;
								b(# + #);
								#();
							}
							{
								# = a;
								b(# * #);
								#(function () {
									d(#);
								});
							}
						});
					}
				}();
			});
		});
	});
} catch (#) {
	# = d(#);
	es(#);
}