import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import panelsStore from 'stores/panelsStore';
import naviStore from 'stores/naviStore';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const { SubMenu, Item: MenuItem } = Menu;

@observer
export default class Navi extends Component {
	static propTypes = {
		menu: PropTypes.any,
		top: PropTypes.bool,
		itemStyle: PropTypes.object,
	};

	static defaultProps = {
		top: false,
	};

	componentWillUnmount() {
		naviStore.disposer();
	}

	_handleClick = ({ item }) => {
		if (panelsStore.isSidebarCollapsed) {
			routerStore.push(item.props.path);
		}
	};

	_handleOpenChange = (openKeys) => {
		naviStore.openKeys = openKeys;
	};

	_renderLink({ title, path, isInternalPath }) {
		const { top } = this.props;
		const collapsed = !top && panelsStore.isSidebarCollapsed;

		// To hide title when collapsed
		if (collapsed) {
			return <span>{title}</span>;
		}

		if (isInternalPath) {
			return (
				<Link to={path} style={styles.link}>
					{title}
				</Link>
			);
		}

		return (
			<a href={path} style={styles.link}>
				{title}
			</a>
		);
	}

	_renderMenu(menuList) {
		if (!menuList) return;

		const { itemStyle } = this.props;
		return menuList
			.map((menu) => {
				if (!menu.children) {
					return !menu.menuKey ? null : (
						<MenuItem key={menu.menuKey} path={menu.path} style={itemStyle}>
							{menu.icon && <Icon type={menu.icon} />}
							{this._renderLink(menu)}
						</MenuItem>
					);
				}
				return (
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
				);
			})
			.filter(Boolean);
	}

	render() {
		const { props: { menu, top, itemStyle, ...other } } = this;
		const { openKeys, selectedKeys } = naviStore;
		return (
			<Menu
				mode={top ? 'horizontal' : 'inline'}
				theme={top ? 'light' : 'dark'}
				selectedKeys={__DEV__ ? toJS(selectedKeys) : selectedKeys}
				openKeys={openKeys}
				onClick={this._handleClick}
				onOpenChange={this._handleOpenChange}
				{...other}
			>
				{this._renderMenu(menu)}
			</Menu>
		);
	}
}
