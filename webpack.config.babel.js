
import { resolve } from 'path';
import webpack from 'webpack';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const backendServerPort = process.env.BACKEND_SERVER_PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';
const PROJECT_PATH = __dirname;
const inProject = (...args) => resolve(PROJECT_PATH, ...args);
const inSrc = inProject.bind(null, 'src');
const srcDir = inSrc();

export default () => {
	const config = {
		devtool: isDev ? 'source-map' : 'none',
		entry: {
			app: [
				'babel-polyfill',
				isDev && 'react-hot-loader/patch',
				`./src/boot/${isDev ? 'dev' : 'prod'}.js`,
			].filter(Boolean),
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
					include: srcDir,
					loader: 'babel-loader',
					options: {
						plugins: [
							isDev && 'react-hot-loader/babel',
						].filter(Boolean),
						forceEnv: 'webpack',
					},
				},
				{
					test: /\.css$/,
					include: srcDir,
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
					include: srcDir,
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
			proxy: {
				'/api': `http://127.0.0.1:${backendServerPort}`,
			}
		},
	};

	return config;
};
