# jsflow

Just another approach to reduce spaghetti code. But not a libary.

It's a compiler.

Other javascript control flow libaries cannot escape from javascript syntax and so they have still much `function() { ... }` spaghetti. With a compiler we are not bound to javascript syntax.

Other compilers (like coffeescript) can reduce it better, but they are not focused on common constructs, but offer only alternative syntax for core constructs.

## Common constructs

``` javascript
/*** vanilla javascript ***/
// sync control flow (without error handling)
var content = fs.readFileSync(input, "utf-8");
var ast = parse(content);
var code = generate(ast);
fs.writeFileSync(output, code, "utf-8");
end();

// async control flow (without error handling)
fs.readFile(input, "utf-8", function(err, content) {
	parse(content, function(err, ast) {
		generate(ast, function(err, code) {
			fs.writeFile(output, code, "utf-8", function(err) {
				end();
			});
		});
	});
});
```

Sync control flow looks still really ok, but async control flow is really spaghetti-like.

If we would add error handling... :(

## jsflow

jsflow try to make it more readable...

It adds a "register" named `#` and flow operators. Here is how the above example looks with jsflow:

``` javascript
/*** jsflow ***/
// sync control flow (with error handling)
fs.readFileSync(input, "utf-8") ->
	parse(#) ->
	generate(#) ->
	fs.writeFileSync(output, #, "utf-8") ->
	end()
~> console.error(#);

// async control flow (with error handling)
fs.readFile(input, "utf-8") -->
	parse(#) -->
	generate(#) -->
	fs.writeFile(output, #, "utf-8") -->
	end()
~~> console.error(#);

// operator  ->   sync flow
// operator  -->  async flow
// operator  ~>   sync error handling flow
// operator  ~~>  async error handling flow
// details below
```

jsflow makes sync and async control flow look very similar, which is very cool.

There are more flow operators. There are described below.

## jsflow operators

### `->` (sync transfer)

Left side must be an expression.

Transfer the "value" of the left side expression into the flow register (#) and continue with right side.

``` javascript
5 -> # + # -> console.log(#); // prints 10
```

### `=>` (sync non-transfer)

Left side can be a statement or expression.

Evaluates the left side, but do not transfer the "value" (statements may not have a value). The flow register (#) is not modified.

You are allowed to modify the flow register in the statement.

``` javascript
5 ->
	var test = # =>
	if (# > 4) {
		# /= 2;
	} =>
	console.log(test) =>
	console.log(#);
// prints 5 and 2.5
```

If you chain many statements you may should use a block, which make if more readable:

``` javascript
5 -> {
	var test = #;
	if (# > 4) {
		# /= 2;
	}
	console.log(test);
	console.log(#);
}
// prints 5 and 2.5
```

### `==>` (async callback)

Left side must be a call expression.

If a `(` is followed a arguments list is excepted.

`leftSide ==> (#err, arg2, #, arg3) rightSide`

The arguments list may contain `#` or `#err`.

`#`: The argument is the new value of the flow register.

`#err`: The argument is an error if set. It is handled by your error handler.

If no arguments list is provided it defaults to `(#)`.

The operator adds an callback to the call expression. The callback has the arguments as specified in the arguments list. The right side is executed when the callback is called from the function on left side. There is no restriction on how many times it can be called.

``` javascript
process.on("exit") ==> ()
	["a", "b", "c"].forEach() ==>
	fs.readFile(#, "utf-8") ==> (#err, #)
	console.log(#);
```

### `-->` (async callback node style)

Shortcut for `==> (#err, #)`

### `~>` (sync error handler)

The left side must be a flow, statement or expression.

The left side is tried (`try`) and if an exception occurs right side is executed. Flow register is set to the exception.

``` javascript
5 -> 
	#.test() // throw an runtime exception
~> console.log(#);
// prints the runtime exception
```

### `~~>` (async error handler)

The left side must be a flow, statement or expression.

Exceptions parsed the async jsflow callbacks are handled through execution of the right side. Flow register is set to the exception.

``` javascript
fs.readFile(input, "utf-8") -->
	parse(#) -->
	generate(#) -->
	fs.writeFile(output, #, "utf-8") -->
	end()
~~> console.error(#);
// prints the error if any async callback is called with an error
```

### `~> ~~>`

You can combine both error types.

`stuff() --> sth(#) ~> ~~> console.error(#)`

### `~>` and `~~>`

An error handler ends the current flow and starts a new one (error handler flow). If you have multiple error handlers chained the second one is the error handler of the error handler.

``` javascript
5 ->
	throw new Error("test") // throws a test error
~> #.test() // throws a runtime error
~> console.error(#)
// prints the runtime error throwed by the first error handler
// async error handling behaves similar
```

### `+~>`

The left side must be a expression, which should evaluate to a function(err).

The value of the left side is set as error handler for both sync and async errors.

``` javascript
function(filename, encoding, callback) {
	callback +~> 
		processFilename(filename) ->
		fs.readFile(#, encoding) -->
		callback(null, #);
}
```

### `+~~>`

Like `+~>` but don't set the sync error handler.

## Future stuff

A syntax for the common `func(#)`, `func(#, a, b)` or `#.func()`.

```
// func! = func(#)
// func a, b = func(#, a, b)
// .func() = #.func()
// .func(a, b) = #.func(a, b)

source ->
	parse {some: "options"} --> {
		.visit ==>
		.attr = true;
	} =>
	generate! ->
	console.log!;

// is equal to

source ->
	parse(#, {some: "options"}) --> {
		#.visit ==>
		#.attr = true;
	} =>
	generate(#) ->
	console.log(#);
```

A simple class construct which fits into jsflow.

```
class Name : SuperName {
	/** constructor **/
	(value) => @value = value;
	// (@value); // shortcut
	// (@value) => #super.call(@); // call super class constructor
	
	/** method returning value **/
	.get() -> @value;
	
	/** method setting value **/
	.set(value) => @value = value;
	// set(@value); // shortcut
	
	/** method modifying and returning value **/
	.increment(#) -> {
		@value += #;
		if(@value > 9000 && @value - # <= 9000)
			@emit("over9000", @value);
		return @value;
	}
	
	/** method with callback **/
	.bindAlarm ==> (value)
		@on("over9000", #callback);
	
	/** method with node-sytle callback
	.checkAlarm(inSec) -->
		setTimeout(##, inSec*1000) ==> ()
		if(@value > 9000)
			#return @value;
		else
			#throw new Error("No alarm");
	
	/** method returning a function **/
	.getLogFunction ->
		return ==> (text)
			console.log(text + " " + @value);
			
	/** static method **/
	name -> "My Class";
}
// @name  is like this.name, but this remembered from start so it 
//           can be use in callbacks.
// #super  simply stores the base class
// .name(arguments)  is a instance method
// name(arguments)  is a static method
//         # can be part of the arguments
// func => code  is a function without return value (procedure)
// func -> code  is a function with a sync return value
// func ==> (xyz) code  is a function with async callback
//                      callback function is included by jsflow
//                      if the first argument of the callback function
//                      is #err than #callback is set as error handler
// #callback  is the callback function included by jsflow
// func --> code  is a shortcut for func ==> (#err, #)
//           than #return and #throw are shortcuts 
//           for #callback(null, result and #callback(err)
```

## Technology

The compiler is a [esprima](https://github.com/ariya/esprima) -> [escodegen](https://github.com/constellation/escodegen) flow, with modified esprima code. Because it is based on esprima it should parse nearly any normal javascript code too.

## Info

jsflow is currently just a experiment for this kind of syntax.

I may use it a few times to experiment with it.

Based on that and on the comments, I may continue to develop the Future Stuff.

## Examples

``` javascript
/*** EventEmitter ***/
ee.on("event") ==> (data) {
	doSomeStuffWith(data);
	andEvenMore(data);
	ee.emit("event2", data)
}
ee.on("event") ==>
	doSomeStuffWith(#) =>
	andEvenMore(#) =>
	ee.emit("event2", #);

/*** jQuery ***/
$(".item").click() ==>
	# = $(this) =>
	#.hide() ->
	#.css({background: "red"});

/*** fs ***/
function printAllFilesLengthIn(filename, callback) {
	var count = 0;
	fs.readFile(filename, "utf-8") -->
		#.split(/\r\n?/g) ->
		count = #.length =>
		#.forEach() ==> (filename)
		fs.readFile(filename, "utf-8") -->
		console.log(filename + ": " + #.length) =>
		if(--count === 0)
			callback();
	~~> if(count >= 0) {
		count = -1;
		callback(#);
	}
}
```

## License

Copyright (C) 2012 Tobias Koppers and other contributors

MIT License

The source contains [esprima](https://github.com/ariya/esprima#license) code.

