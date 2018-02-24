import 'antd/dist/antd.less';
import './reset.scss';
import React, { Component } from 'react';
import {
	Admin,
	Title,
	Footer,
	API,
	Auth,
	Upload,
	Navigator,
	Menu,
	Modal,
	ErrorMessages,
	Toolbar,
	CreateButton,
	ContextButton,
} from '../src';
import testTable from './tables/test';
import fooTable from './tables/foo';
import FooModal from './modals/Foo';

export default class App extends Component {
	render() {
		return (
			<Admin>
				<Title>上帝的看板</Title>

				<Navigator>
					<Menu icon="home" title="菜单一" path="/" exact />
					<Menu
						icon="line-chart"
						title="菜单二"
						table="test"
						path="/test"
						pageTitle="测试数据表"
					/>
					<Menu icon="picture" title="菜单三">
						<Menu icon="bulb" title="2.1" path="/fork" exact />
						<Menu icon="bulb" title="2.2">
							<Menu icon="bulb" title="3.1">
								<Menu
									icon="bulb"
									title="4.1"
									table="foo"
									path="/foo"
									toolbar={() => (
										<Toolbar
											left={<CreateButton />}
											right={
												<ContextButton
													onClick={(ev, { open }) => {
														ev.preventDefault();
														open('custom', {
															title: 'My Custom Modal',
															useLocation: true,
														});
													}}
													label="自定义弹框"
												/>
											}
										/>
									)}
								/>
							</Menu>
						</Menu>
					</Menu>
				</Navigator>

				<ErrorMessages
					defaulst="操作失败"
					statusMap={{
						401: '请重新登录',
						403: '权限不足',
						404: '找不到对象',
						500: '系统错误',
					}}
					getMessage={async (_, response) => {
						if (response.status === 400) {
							const error = await response.json();
							return error.reason;
						}
					}}
				/>

				<API
					baseURL="/api"
					count={5}
					accessTokenName="accessToken"
					accessTokenLocation="query"
					sortKey="s"
					orderKey="o"
					descValue="-1"
					ascValue="1"
				/>

				<Auth basePath="auth" loginPath="login" getUserPath="getUser" />

				<Upload imagePath="/api/upload/image" filePath="/api/upload/file" />

				<Modal name="custom" component={FooModal} />

				{testTable}
				{fooTable}

				<Footer>Powered by cantonjs</Footer>
			</Admin>
		);
	}
}
