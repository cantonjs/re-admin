
import 'antd/dist/antd.less';
import './reset.scss';
import React, { Component } from 'react';
import {
	Admin, Title, API, Auth, Upload, Navigator, Menu,
	Toolbar, CreateButton,
} from '../src';
import testTable from './tables/test';
import helloTable from './tables/hello';

export default class App extends Component {
	render() {
		return (
			<Admin>
				<Title>上帝的看板</Title>

				<Navigator>
					<Menu icon="bulb" title="菜单一" path="/" exact />
					<Menu
						icon="bulb"
						title="菜单二"
						table="test"
						path="/test"
						pageTitle="测试数据表"
					/>
					{/*<Menu icon="bulb" title="菜单三">
						<Menu icon="bulb" title="2.1" path="/fork" exact />
						<Menu
							title="2.2"
							table="hello"
							path="/hello"
							toolbar={() => (
								<Toolbar
									left={<CreateButton />}
								/>
							)}
						/>
					</Menu>*/}

					<Menu icon="bulb" title="菜单三">
						<Menu icon="bulb" title="2.1" path="/fork" exact />
						<Menu icon="bulb" title="2.2">
							<Menu icon="bulb" title="3.1">
								<Menu
									icon="bulb"
									title="4.1"
									table="hello"
									path="/hello"
									toolbar={() => (
										<Toolbar
											left={<CreateButton />}
										/>
									)}
								/>
							</Menu>
						</Menu>
					</Menu>

				</Navigator>

				<API
					baseURL="/api"
					count={5}
					accessTokenName="accessToken"
					accessTokenLocation="query"
				/>

				<Auth basePath="auth" loginPath="login" getUserPath="getUser" />
				<Upload
					imagePath="/api/upload/image"
					filePath="/api/upload/file"
				/>

				{testTable}
				{helloTable}

			</Admin>
		);
	}
}
