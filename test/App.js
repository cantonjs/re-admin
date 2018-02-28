import 'antd/dist/antd.less';
import './reset.less';
import React, { Component } from 'react';
import {
	Admin,
	Logo,
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
import { Icon } from 'antd';
import testTable from './tables/test';
import fooTable from './tables/foo';
import FooModal from './modals/Foo';
import Login from './components/Login';

const isGithubPage = /\.github\.io$/.test(window.location.host);
const basename = isGithubPage ? '/re-admin' : '/';

export default class App extends Component {
	render() {
		return (
			<Admin
				locale={{
					CreateButton: { label: '新建' },
					TableBody: { total: '共' },
					ArrayOf: { addButtonLabel: 'fork' },
					ActionsField: { label: 'fork' },
				}}
			>
				<Title>上帝的看板</Title>
				<Logo>
					<Icon type="rocket" style={{ fontSize: 20 }} />
				</Logo>

				<Navigator basename={basename} login={Login}>
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
						<Menu icon="bulb" title="2.2" path="/bar">
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

				<Footer>
					<a
						href="https://github.com/cantonjs/re-admin"
						style={{ color: '#999', marginRight: 10 }}
					>
						<Icon type="github" />
					</a>{' '}
					Powered by <a href="https://github.com/cantonjs">Cantonjs</a>
				</Footer>
			</Admin>
		);
	}
}
