
import React, { Component } from 'react';
import { Admin, Title, Table, Sidebar, API, Auth, Upload } from '../src'; // eslint-disable-line
import sidebar from './config/sidebar';
import test from './config/tables/test';
import hello from './config/tables/hello';

export default class App extends Component {
	render() {
		return (
			<Admin>
				<Title>上帝的看板</Title>
				<Sidebar>{sidebar}</Sidebar>
				<API baseURL="/api" count={5} />
				<Auth basePath="auth" loginPath="login" getUserPath="getUser" />
				<Upload imagePath="/api/upload/image" filePath="upload/file" />
				<Table name="test" title="测试数据表">{test}</Table>
				<Table name="hello">{hello}</Table>
			</Admin>
		);
	}
}
