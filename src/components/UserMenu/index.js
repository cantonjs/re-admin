import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routerStore from 'stores/routerStore';
import { Modal, Icon, Menu, Dropdown, Avatar } from 'antd';
import locale from 'hoc/locale';

const { confirm } = Modal;
const { Item } = Menu;

@locale()
export default class UserMenu extends Component {
	static propTypes = {
		style: PropTypes.object,
	};

	static contextTypes = {
		authStore: PropTypes.object,
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		const { confirmSignOut, signOut } = this.locale;
		confirm({
			title: confirmSignOut,
			onOk: () => {
				this.context.authStore.logout();
				routerStore.history.replace('/login');
			},
			okText: signOut,
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
								<Icon type="logout" /> {this.locale.signOut}
							</a>
						</Item>
					</Menu>
				}
				trigger={['click']}
			>
				<div style={styles.container(style)}>
					<Avatar icon="user" size="small" />
					<span style={styles.text}>Admin</span>
					<Icon type="down" />
				</div>
			</Dropdown>
		);
	}
}
