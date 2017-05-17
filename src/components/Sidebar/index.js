
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import Logout from 'components/Logout';

const { SubMenu, Item: MenuItem } = Menu;

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
			context: { appConfig: { sidebar, title } },
		} = this;
		return (
			<div className={$$.container}>
				<div className={$$.title}>{title}</div>
				<Menu
					className={$$.menu}
					mode="inline"
				>
					{sidebar.map((item, index) => {
						return item.children && item.children.length ?
							<SubMenu
								key={index}
								title={
									<span>
										{item.icon && <Icon type={item.icon} />}
										{item.name}
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
												{childItem.name}
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
												>{leafItem.name}</Link>
											</MenuItem>
										)}
									</SubMenu> :
									<MenuItem key={index + '-' + childIndex}>
										{childItem.icon && <Icon type={childItem.icon} />}
										<Link
											to={childItem.path}
											style={{ display: 'inline' }}
										>{childItem.name}</Link>
									</MenuItem>
							)}
							</SubMenu> :
							<MenuItem key={index}>
								{item.icon && <Icon type={item.icon} />}
								<Link
									to={item.path}
									style={{ display: 'inline' }}
								>{item.name}</Link>
							</MenuItem>;
					})}
				</Menu>
				<Logout className={$$.footer} />
			</div>
		);
	}

}

