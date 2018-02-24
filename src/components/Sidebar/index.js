import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Icon, Layout } from 'antd';
import routerStore from 'stores/routerStore';
import { isObservableArray } from 'mobx';

const { Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

export default class Sidebar extends Component {
	static propTypes = {
		collapsed: PropTypes.bool.isRequired,
		onCollapse: PropTypes.func.isRequired,
	};

	static contextTypes = {
		appConfig: PropTypes.object,
	};

	static isPrivate = true;

	state = {
		collapsed: false,
	};

	componentWillMount() {
		this._defaultSelectedKeys = [routerStore.location.pathname];
		this._defaultOpenKeys = this._findDefaultOpenKeys();
	}

	_findDefaultOpenKeys() {
		const { menus } = this.context.appConfig.navigator;
		const { pathname } = routerStore.location;
		const findMenuTree = (menus, paths = []) => {
			if (!menus) {
				return;
			}
			if (Array.isArray(menus) || isObservableArray(menus)) {
				for (const menu of menus) {
					const matched = findMenuTree(
						menu.children,
						paths.concat(menu.menuKey)
					);
					if (matched) {
						return matched;
					}
					if (menu.path === pathname) {
						return paths;
					}
				}
			}
		};

		return findMenuTree(menus);
	}

	_renderMenu(menus) {
		if (!menus) {
			return;
		}

		const { collapsed } = this.props;

		return menus.map(
			(menu) =>
				menu.children && menu.children.length ? (
					<SubMenu
						key={menu.menuKey}
						title={
							<span>
								{menu.icon && <Icon type={menu.icon} />}
								<span>{menu.title}</span>
							</span>
						}
					>
						{this._renderMenu(menu.children)}
					</SubMenu>
				) : (
					<MenuItem key={menu.menuKey}>
						{menu.icon && <Icon type={menu.icon} />}
						<Link
							to={menu.path}
							style={{ ...styles.link, opacity: collapsed ? 0 : 1 }}
						>
							{menu.title}
						</Link>
					</MenuItem>
				)
		);
	}

	render() {
		const {
			context: { appConfig: { navigator, title } },
			props: { collapsed, onCollapse },
			_defaultSelectedKeys,
			_defaultOpenKeys,
		} = this;

		return (
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={onCollapse}
				style={styles.container}
			>
				<div style={styles.title}>
					{collapsed ? <Icon type="copyright" /> : title}
				</div>
				<Menu
					mode="inline"
					theme="dark"
					defaultSelectedKeys={_defaultSelectedKeys}
					defaultOpenKeys={_defaultOpenKeys}
				>
					{this._renderMenu(navigator.menus)}
				</Menu>
			</Sider>
		);
	}
}
