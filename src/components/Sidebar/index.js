
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import Logout from 'components/Logout';

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

	render() {
		const {
			context: { appConfig: { navigator, title } },
		} = this;
		return (
			<div style={styles.container}>
				<div style={styles.title}>{title}</div>
				<Menu
					style={styles.menu}
					mode="inline"
				>
					{navigator.menus.map((item, index) => {
						return item.children && item.children.length ?
							<SubMenu
								key={index}
								title={
									<span>
										{item.icon && <Icon type={item.icon} />}
										{item.title}
									</span>
								}
							>
							{item.children.map((childItem, childIndex) =>
								childItem.children && childItem.children.length ?
									<SubMenu
										key={index + '-' + childIndex}
										title={
											<span>
												{childItem.icon && <Icon type={childItem.icon} />}
												{childItem.title}
											</span>
										}
									>
										{childItem.children.map((leafItem, leafIndex) =>
											<MenuItem
												key={index + '-' + childIndex + '-' + leafIndex}
											>
												{leafItem.icon && <Icon type={leafItem.icon} />}
												<Link
													to={leafItem.path}
													style={{ display: 'inline' }}
												>{leafItem.title}</Link>
											</MenuItem>
										)}
									</SubMenu> :
									<MenuItem key={index + '-' + childIndex}>
										{childItem.icon && <Icon type={childItem.icon} />}
										<Link
											to={childItem.path}
											style={{ display: 'inline' }}
										>{childItem.title}</Link>
									</MenuItem>
							)}
							</SubMenu> :
							<MenuItem key={index}>
								{item.icon && <Icon type={item.icon} />}
								<Link
									to={item.path}
									style={{ display: 'inline' }}
								>{item.title}</Link>
							</MenuItem>;
					})}
				</Menu>
				<Logout style={styles.footer} />
			</div>
		);
	}

}

