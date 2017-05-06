
import './style.css';
import 'antd/dist/antd.less';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { children } = this.props;

		console.log('props', this.props);

		return (
			<div>
				<h1>Admin</h1>
				<div>{children}</div>
			</div>
		);
	}
}
