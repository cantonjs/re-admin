
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routerStore from 'stores/router';
import { Modal } from 'antd';

const confirm = Modal.confirm;

export default class Logout extends Component {
	static propTypes = {
		style: PropTypes.object,
	};

	static contextTypes = {
		authStore: PropTypes.object,
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		confirm({
			title: '确定退出登录？',
			onOk: () => {
				this.context.authStore.logout();
				routerStore.history.replace('/login');
			},
			okText: '退出登录',
		});
	};

	render() {
		const { style } = this.props;
		return (
			<a
				style={style}
				onClick={this._handleClick}
				href="#"
			>退出登录</a>
		);
	}
}
