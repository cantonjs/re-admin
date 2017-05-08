
const { resolve } = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isDev = process.env.NODE_ENV !== 'production';

const PROJECT_PATH = __dirname;
const inProject = (...args) => resolve(PROJECT_PATH, ...args);
const inSrc = inProject.bind(null, 'src');
const inTest = inProject.bind(null, 'test');
const srcDir = inSrc();
const testDir = inTest();

module.exports = (webpackEnv = {}) => {
	const { minify } = webpackEnv;

	const config = {
		devtool: 'source-map',
		entry: {
			app: [
				'babel-polyfill',
				'react-hot-loader/patch',
				'./src/index.js',
			],
		},
		output: {
			filename: 'bundle.js',
			path: resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [srcDir, testDir],
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					include: inSrc(),
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								sourceMap: isDev,
								module: true,
								localIdentName: isDev ?
									'[path]-[name]-[local]-[hash:base64:3]' : '[hash:base64:7]'
								,
							},
						}
					],
				},
				{
					test: /\.css$/,
					include: /node_modules/,
					use: [
						'style-loader',
						'css-loader',
					],
				},
				{
					test: /\.scss$/,
					include: inSrc(),
					use: [
						'style-loader',
						{
							loader: 'css-loader',
							options: {
								sourceMap: isDev,
								module: true,
								localIdentName: isDev ?
									'[path]-[name]-[local]-[hash:base64:3]' : '[hash:base64:7]'
								,
							},
						},
						{
							loader: 'sass-loader',
							options: {
								includePaths: [inSrc('styles')],
							},
						},
					],
				},
				{
					test: /\.less$/,
					include: /node_modules/,
					use: [
						'style-loader',
						'css-loader',
						'less-loader',
					],
				},
			],
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				__DEV__: isDev,
			}),
		],
		resolve: {
			modules: [srcDir, 'node_modules'],
			extensions: ['.js'],
		},
		resolveLoader: {
			moduleExtensions: ['-loader'],
		},
		devServer: {
			contentBase: 'src',
			hot: true,
			stats: {
				chunkModules: false,
				colors: true,
			},
			historyApiFallback: {
				disableDotRule: true,
			},
		},
	};


	if (minify) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin(),
		);
	}

	return config;
};
