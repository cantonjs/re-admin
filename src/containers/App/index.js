
import './reset.css';
import 'antd/dist/antd.less';
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sidebar from 'components/Sidebar';

export default class App extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { children } = this.props;
		return (
			<div>
				<Sidebar />
				<div className={$$.main}>{children}</div>
			</div>
		);
	}
}
