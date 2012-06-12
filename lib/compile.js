/*!
 * jsflow
 *
 * Copyright (C) 2012 Tobias Koppers and other contributors
 * Licensed MIT
 * http://www.opensource.org/licenses/mit-license.php
 */
var esprima = require("./jsflow-esprima");
var escodegen = require("escodegen");

module.exports = function(code, options) {
	var ast = esprima.parse(code);

	ast.body.unshift({
		type: esprima.Syntax.VariableDeclaration,
		declarations: [{
			type: esprima.Syntax.VariableDeclarator,
			id: { type: 'Identifier', name: '__jsflow__' }
		}],
		kind: 'var'
	});

	return escodegen.generate(ast, {
		format: {
			indent: {
				style: '\t'
			}
		}
	});
}