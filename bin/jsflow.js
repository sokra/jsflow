#!/usr/bin/env node
/*!
 * jsflow
 *
 * Copyright (C) 2012 Tobias Koppers and other contributors
 * Licensed MIT
 * http://www.opensource.org/licenses/mit-license.php
 */
var jsflow = require("../lib/jsflow");
var fs = require("fs");

var file = process.argv[2];
var output = process.argv[3];

if(file) {
	fs.readFile(file, "utf-8", function(err, content) {
		if(err) throw err;
		compile(content);
	});
} else {
	var content = [];
	process.stdin.resume();
	process.stdin.on("data", function(data) {
		content.push(data);
	});
	process.stdin.on("end", function() {
		process.stdin.pause();
		compile(content.join(""));
	});
}

function compile(content) {
	var result = jsflow.compile(content);
	if(output) {
		fs.writeFileSync(output, result, "utf-8");
	} else {
		process.stdout.write(result);
	}
}