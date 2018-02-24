import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import panelsStore from 'stores/panelsStore';
import { Link } from 'react-router-dom';
import { Menu, Icon, Layout } from 'antd';

const { Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

@observer
export default class Sidebar extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
	};

	static isPrivate = true;

	componentWillMount() {
		this._defaultSelectedKeys = [routerStore.location.pathname];
		this._defaultOpenKeys = this._findDefaultOpenKeys();
	}

	_handleCollapse = (collapsed) => {
		panelsStore.updateSidebar(collapsed);
	};

	_handleClick = ({ item }) => {
		if (panelsStore.isSidebarCollapsed) {
			routerStore.push(item.props.path);
		}
	};

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

		const { isSidebarCollapsed } = panelsStore;

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
					<MenuItem key={menu.menuKey} path={menu.path}>
						{menu.icon && <Icon type={menu.icon} />}

						{/* To hide title when collapsed */}
						{isSidebarCollapsed && <span>{menu.title}</span>}
						{!isSidebarCollapsed && (
							<Link to={menu.path} style={styles.link}>
								{menu.title}
							</Link>
						)}
					</MenuItem>
				)
		);
	}

	render() {
		const {
			context: { appConfig: { navigator, title } },
			_defaultSelectedKeys,
			_defaultOpenKeys,
		} = this;
		const { isSidebarCollapsed } = panelsStore;
		return (
			<Sider
				collapsible
				collapsed={isSidebarCollapsed}
				onCollapse={this._handleCollapse}
				style={styles.container}
			>
				<div style={styles.title}>
					{isSidebarCollapsed ? <Icon type="copyright" /> : title}
				</div>
				<Menu
					mode="inline"
					theme="dark"
					defaultSelectedKeys={_defaultSelectedKeys}
					defaultOpenKeys={_defaultOpenKeys}
					onClick={this._handleClick}
				>
					{this._renderMenu(navigator.menus)}
				</Menu>
			</Sider>
		);
	}
}
