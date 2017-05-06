
import './style.css';
import 'antd/dist/antd.less';
import React, { Component, PropTypes } from 'react';

export default class App extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { children } = this.props;

		return (
			<div>
				<h1>Admin</h1>
				<div>{children}</div>
			</div>
		);
	}
}
