
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Modal } from 'antd';

const confirm = Modal.confirm;

@withRouter
export default class Logout extends Component {
	static propTypes = {
		className: PropTypes.string,
		router: PropTypes.object,
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
				this.props.router.replace('/login');
			},
			okText: '退出登录',
		});
	};

	render() {
		const { className } = this.props;
		return (
			<a
				className={className}
				onClick={this._handleClick}
				href="#"
			>退出登录</a>
		);
	}
}
