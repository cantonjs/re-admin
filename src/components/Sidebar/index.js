import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import panelsStore from 'stores/panelsStore';
import MenuKeysStore from './MenuKeysStore';
import { Link } from 'react-router-dom';
import { Menu, Icon, Layout } from 'antd';

const { Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

@observer
export default class Sidebar extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
	};

	componentWillMount() {
		const { menus } = this.context.appConfig.navigator;
		const { location } = routerStore;
		this._keysStore = new MenuKeysStore(menus, location);
	}

	componentWillUnmount() {
		this._keysStore.disposer();
	}

	_handleCollapse = (collapsed) => {
		panelsStore.updateSidebar(collapsed);
	};

	_handleClick = ({ item }) => {
		if (panelsStore.isSidebarCollapsed) {
			routerStore.push(item.props.path);
		}
	};

	_handleOpenChange = (openKeys) => {
		this._keysStore.openKeys = openKeys;
	};

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
			context: { appConfig: { navigator: { menus }, title } },
			_keysStore,
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
					selectedKeys={_keysStore.selectedKeys}
					openKeys={_keysStore.openKeys}
					onClick={this._handleClick}
					onOpenChange={this._handleOpenChange}
				>
					{this._renderMenu(menus)}
				</Menu>
			</Sider>
		);
	}
}
