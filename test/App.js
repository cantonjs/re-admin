
import 'antd/dist/antd.less';
import './reset.scss';
import React, { Component } from 'react';
import { Admin, Title, Table, API, Auth, Upload, Navigator, Menu } from '../src';
import test from './tables/test';
import hello from './tables/hello';

export default class App extends Component {
	render() {
		return (
			<Admin>
				<Title>上帝的看板</Title>

				<Navigator>
					<Menu icon="bulb" title="菜单一" path="/" />
					<Menu
						icon="bulb"
						title="菜单二"
						table="test"
						path="/test"
						pageTitle="测试数据表"
					/>
					<Menu icon="bulb" title="菜单三">
						<Menu title="2.2" table="hello" path="/hello" />
					</Menu>
				</Navigator>

				<API
					baseURL="/api"
					count={5}
					accessTokenName="accessToken"
					accessTokenLocation="query"
				/>

				<Auth basePath="auth" loginPath="login" getUserPath="getUser" />
				<Upload imagePath="/api/upload/image" filePath="upload/file" />

				<Table name="test">{test}</Table>
				<Table name="hello">{hello}</Table>
			</Admin>
		);
	}
}
