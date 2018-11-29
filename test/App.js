import 'antd/dist/antd.less';
import 'react-quill/dist/quill.snow.css';
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
	Locale,
	ErrorMessages,
	Toolbar,
	CreateButton,
	ContextButton,
} from '../src';
import locale from '../locales/en_US';
import { Icon } from 'antd';
import testTable from './tables/test';
import barTable from './tables/bar';
import articleTable from './tables/article';
import FooModal from './modals/Foo';
import Login from './components/Login';
import CustomFormPage from './components/CustomFormPage';

const isGithubPage = /\.github\.io$/.test(window.location.host);
const basename = isGithubPage ? '/re-admin' : '/';

export default class App extends Component {
	render() {
		return (
			<Admin>
				<Title>{'God\'s Vision'}</Title>
				<Locale>{locale}</Locale>
				<Logo>
					<Icon type="rocket" style={{ fontSize: 20 }} />
				</Logo>

				<Navigator basename={basename} login={Login}>
					<Menu icon="home" title="Home" path="/" exact />
					<Menu
						icon="line-chart"
						title="My Table"
						table="test"
						path="/table"
						pageTitle="Testing Table"
					/>
					<Menu
						icon="file-text"
						title="Articles"
						table="article"
						path="/articles"
						pageTitle="Articles"
						useDetail
					/>
					<Menu icon="picture" title="Sub Menu">
						<Menu icon="bulb" title="2.1" path="/404" exact />
						<Menu icon="bulb" title="2.2" path="/foo">
							<Menu icon="bulb" title="3.1">
								<Menu
									icon="bulb"
									title="4.1"
									table="bar"
									path="/bar"
									toolbar={() => (
										<Toolbar
											left={<CreateButton />}
											right={
												<ContextButton
													onClick={(ev, { dispatch }) => {
														ev.preventDefault();
														dispatch('custom', {
															title: 'My Custom Modal',
														});
													}}
													label="Custom Modale"
												/>
											}
										/>
									)}
								/>
							</Menu>
						</Menu>
					</Menu>
					<Menu
						icon="setting"
						title="Settings"
						path="/settings"
						component={CustomFormPage}
					/>

					<Menu
						top
						icon="github"
						title="Github"
						path="https://github.com/cantonjs/re-admin"
					/>
				</Navigator>

				<ErrorMessages
					default="Faied"
					statusMap={{
						401: 'Login required',
						403: 'Forbidden',
						404: 'Page not found',
						500: 'Server error',
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
				{barTable}
				{articleTable}

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
