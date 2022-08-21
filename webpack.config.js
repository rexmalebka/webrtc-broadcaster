const path = require('path')
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
	entry: {
		app: path.resolve(__dirname, 'src/app.ts'),
	},
	output: {
		path: path.resolve(__dirname, 'static'),
		filename: 'js/[name].js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	plugins: [
		new VueLoaderPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'

			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options:{
					appendTsSuffixTo: [/\.vue$/],
				}
			},{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	}
}
