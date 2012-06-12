var should = require("should");
var fs = require("fs");
var path = require("path");
var compile = require("../lib/compile");

var cases = path.join(__dirname, "cases");

var files = fs.readdirSync(cases).filter(function(file) {
	return /\.jsf$/.test(file) && !/\.todo\./.test(file);
}).map(function(file) {
	return file.replace(/\.jsf$/, "");
});


describe("jsflow", function() {
	files.forEach(function(test) {
		var name = test.replace(/[-.]/g, " ");
		describe(name, function(done) {
			var sourcePath = path.join(cases, test + ".jsf");
			var resultPath = path.join(cases, test + ".js");
			var source = fs.readFileSync(sourcePath, "utf-8");
			var result = fs.readFileSync(resultPath, "utf-8").replace(/\r\n?/g, "\n").replace(/#/g, "__jsflow__");

			it("should compile correctly", function() {
				var actual = compile(source);
				// console.dir(result);
				// console.dir(actual);
				try {
					actual.replace(/[\t ]/g, "").should.be.equal(
						result.replace(/[\t ]/g, "")
					);
				} catch(e) {
					actual.trim().should.be.equal(
						result.trim().replace(/\\n/g, "\n")
					);
					return;
				}
				JSON.stringify(actual.trim()).replace(/\\n/g, "\n").should.be.equal(
					JSON.stringify(result.trim()).replace(/\\n/g, "\n")
				);
			});
			
		});
	});
});