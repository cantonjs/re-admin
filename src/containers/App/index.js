
import './reset.scss';
import 'antd/dist/antd.less';
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/Sidebar';
import getAppConfig from 'utils/getAppConfig';
import auth from 'stores/auth';

export default class App extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static childContextTypes = {
		appConfig: PropTypes.object,
		auth: PropTypes.object,
	};

	getChildContext() {
		return { appConfig: getAppConfig(), auth };
	}

	render() {
		const { children } = this.props;
		return (
			<div className={$$.container}>
				<Sidebar />
				<div className={$$.main}>{children}</div>
			</div>
		);
	}
}
