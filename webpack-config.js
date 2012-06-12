module.exports = {
	resolve: {
		loaders: [{
			test: /\.jsf$/,
			loader: require("path").join(__dirname, "lib/loader.js")
		}]
	}
}