var __jsflow__;
function multi() {
	var count = 0;
	var done = false;
	var listeners = [];
	function finished(err) {
		if (done)
			return;
		done = true;
		listeners.forEach(function (__jsflow__) {
			__jsflow__(err);
		});
	}
	return {
		start: function () {
			count++;
			return finished;
		},
		end: function () {
			count--;
			if (count == 0)
				finished();
		},
		continueArray: function (arr) {
			count += arr.length - 1;
			if (count == 0)
				finished();
		},
		done: function (cb) {
			listeners.push(cb);
		}
	};
}
var fs = require('fs');
var path = require('path');
var files = {};
var m = multi();
{
	var __jsflow__errHandler1 = m.start();
	fs.readdir(__dirname, function (__jsflow__err, __jsflow__) {
		if (__jsflow__err)
			return __jsflow__errHandler1(__jsflow__err);
		m.continueArray(__jsflow__);
		__jsflow__.forEach(function (__jsflow__) {
			var p = __jsflow__;
			__jsflow__ = path.join(__dirname, __jsflow__);
			fs.readFile(__jsflow__, 'utf-8', function (__jsflow__err, __jsflow__) {
				if (__jsflow__err)
					return __jsflow__errHandler1(__jsflow__err);
				files[p] = __jsflow__;
				m.end();
			});
		});
	});
}
{
	var __jsflow__errHandler2 = function (__jsflow__) {
		console.error(__jsflow__);
	};
	m.done(function (__jsflow__err, __jsflow__) {
		if (__jsflow__err)
			return __jsflow__errHandler2(__jsflow__err);
		__jsflow__ = files;
		__jsflow__ = Object.keys(__jsflow__);
		console.dir(__jsflow__);
	});
}