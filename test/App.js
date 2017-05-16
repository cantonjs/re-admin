
import React, { Component } from 'react';
import Admin from 'containers/Admin';
import sidebar from './config/sidebar';
import test from './config/schemas/test';

export default class App extends Component {
	render() {
		return (
			<Admin
				config={{
					name: '上帝的看板',
					sidebar,
					api: {
						baseURL: '/api',
						count: 5,
					},
					auth: {
						basePath: 'auth',
						loginPath: 'login',
						getUserPath: 'getUser',
					},
					upload: {
						imagePath: '/api/upload/image',
						filePath: 'upload/file',
					},
					tables: {
						test,
					},
				}}
			/>
		);
	}
}
