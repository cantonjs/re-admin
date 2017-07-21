
import { resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const backendServerPort = process.env.BACKEND_SERVER_PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';
const PROJECT_PATH = __dirname;
const inProject = (...args) => resolve(PROJECT_PATH, ...args);
const inSrc = inProject.bind(null, 'src');
const srcDir = inSrc();
const inTest = inProject.bind(null, 'test');
const testDir = inTest();

export default (env = {}) => {
	const { build, min } = env;
	const config = {
		devtool: isDev ? 'source-map' : 'none',
		entry: {
			app: [
				'babel-polyfill',
				isDev && 'react-hot-loader/patch',
				'./test/client.js',
			].filter(Boolean),
		},
		output: {
			filename: 'bundle.[hash:7].js',
			path: resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [srcDir, testDir],
					loader: 'babel-loader',
					options: {
						forceEnv: build ? 'umd' : 'demo',
					},
				},
				{
					test: /\.css$/,
					include: [srcDir, testDir],
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
					include: [srcDir, testDir],
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
			isDev && new webpack.HotModuleReplacementPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				__DEV__: isDev,
			}),
			!build && new HtmlWebpackPlugin({
				filename: 'index.html',
				template: './test/index.html',
				minify: {
					collapseWhitespace: true,
					minifyJS: true,
				},
			}),
			build && new webpack.optimize.ModuleConcatenationPlugin(),
		].filter(Boolean),
		resolve: {
			modules: [srcDir, testDir, 'node_modules'],
			extensions: ['.js'],
		},
		resolveLoader: {
			moduleExtensions: ['-loader'],
		},
		devServer: {
			contentBase: 'test',
			hot: true,
			stats: {
				chunkModules: false,
				colors: true,
			},
			historyApiFallback: {
				disableDotRule: true,
			},
			proxy: {
				'/api': `http://127.0.0.1:${backendServerPort}`,
			}
		},
	};

	if (build) {
		config.entry = './src/index.js';

		Object.assign(config.output, {
			library: 'ReAdmin',
			libraryTarget: 'umd',
			filename: `re-admin${min ? '.min' : ''}.js`,
		});

		config.externals = {
			react: 'React',
			'react-dom': 'ReactDom',
			'react-router-dom': 'ReactRouterDOM',
			mobx: 'mobx',
			'mobx-react': 'mobxReact',
			antd: 'antd',
		};
	}

	return config;
};
