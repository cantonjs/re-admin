
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import Logout from 'components/Logout';
import routerStore from 'stores/routerStore';

const { SubMenu, Item: MenuItem } = Menu;

const border = '1px solid rgb(233, 233, 233)';
const styles = {
	container: {
		width: 240,
		position: 'fixed',
		left: 0,
		top: 0,
		bottom: 0,
		display: 'flex',
		flexDirection: 'column',
		zIndex: 9,
		borderRight: border,
	},
	title: {
		height: 64,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 20,
		borderBottom: border,
		backgroundColor: '#fff',
	},
	menu: {
		flexGrow: 1,
		overflowY: 'scroll',
		borderRightWidth: 0,
	},
	link: {
		display: 'inline',
	},
	footer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 44,
		fontSize: 14,
		borderTop: border,
	},
};

export default class Sidebar extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
	};

	static isPrivate = true;

	state = {
		openKeys: [],
	};

	componentWillMount() {
		this._defaultSelectedKeys = [routerStore.location.pathname];
		this._defaultOpenKeys = this._findDefaultOpenKeys();
	}

	_findDefaultOpenKeys() {
		const { menus } = this.context.appConfig.navigator;
		const { pathname } = routerStore.location;

		const findMenuTree = (menus, paths = []) => {
			if (!menus) { return; }
			if (Array.isArray(menus)) {
				for (const menu of menus) {
					const matched = findMenuTree(
						menu.children,
						paths.concat(menu.menuKey),
					);
					if (matched) { return matched; }
					if (menu.path === pathname) { return paths; }
				}
			}
		};

		return findMenuTree(menus);
	}

	_renderMenu(menus) {
		if (!menus) { return; }

		return menus.map((menu) =>
			menu.children && menu.children.length ?
				<SubMenu
					key={menu.menuKey}
					title={
						<span>
							{menu.icon && <Icon type={menu.icon} />}
							{menu.title}
						</span>
					}
				>
					{this._renderMenu(menu.children)}
				</SubMenu> :
				<MenuItem key={menu.menuKey}>
					{menu.icon &&
						<Icon type={menu.icon} />
					}
					<Link to={menu.path} style={styles.link}>
						{menu.title}
					</Link>
				</MenuItem>
		);
	}

	render() {
		const {
			context: { appConfig: { navigator, title } },
			_defaultSelectedKeys,
			_defaultOpenKeys,
		} = this;

		return (
			<div style={styles.container}>
				<div style={styles.title}>{title}</div>
				<Menu
					style={styles.menu}
					mode="inline"
					defaultSelectedKeys={_defaultSelectedKeys}
					defaultOpenKeys={_defaultOpenKeys}
				>
					{this._renderMenu(navigator.menus)}
				</Menu>
				<Logout style={styles.footer} />
			</div>
		);
	}

}

