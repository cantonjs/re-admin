import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routerStore from 'stores/routerStore';
import { Modal, Icon, Menu, Dropdown } from 'antd';

const { confirm } = Modal;
const { Item } = Menu;

export default class UserMenu extends Component {
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
			<Dropdown
				overlay={
					<Menu>
						<Item>
							<a rel="noopener noreferrer" onClick={this._handleClick} href="#">
								<Icon type="logout" /> 退出登录
							</a>
						</Item>
					</Menu>
				}
				trigger={['click']}
			>
				<a href="#" style={style}>
					<Icon type="user" />
					Admin
				</a>
			</Dropdown>
		);
	}
}
