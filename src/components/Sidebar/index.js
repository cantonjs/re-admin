import $$ from './style.scss';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import items from 'config/sidebar.js';
import { name } from 'config/app.js';
// import {sidebarCollapseCreator} from '../../redux/Sidebar.js';


const { SubMenu } = Menu;
const { Item: MenuItem } = Menu;

export default class Sidebar extends Component {

	state = {
		openKeys: []
	};

	handleClick = (e) => {
		console.log('click ', e);
	}

	render() {
		return (
			<div className={$$.container}>
				<div className={$$.title}>{name}</div>
				<Menu
					onClick={this.handleClick}
					className={$$.menu}
					mode="inline"
					>
					{items.map((item, index) => {
						return item.children && item.children.length ?
							<SubMenu
								key={index}
								title={<span>{item.icon && <Icon type={item.icon} />}{item.name}</span>}
							>
								{item.children.map((childItem, childIndex) => {
									return childItem.children && childItem.children.length ?
											<SubMenu
												key={index + '-' + childIndex}
												title={<span>{childItem.icon && <Icon type={childItem.icon} />}{childItem.name}</span>}
											>
												{childItem.children.map((leafItem, leafIndex) =>
													<MenuItem key={index + '-' + childIndex + '-' + leafIndex}>
														{leafItem.icon && <Icon type={leafItem.icon} />}
														<Link to={leafItem.path} style={{ display: 'inline' }}>{leafItem.name}</Link>
													</MenuItem>
												)}
											</SubMenu>
											:
											<MenuItem key={index + '-' + childIndex}>
												{childItem.icon && <Icon type={childItem.icon} />}
												<Link to={childItem.path} style={{ display: 'inline' }}>{childItem.name}</Link>
											</MenuItem>;
								})}
							</SubMenu>
							:
							<MenuItem key={index}>
								{item.icon && <Icon type={item.icon} />}
								<Link to={item.path} style={{ display: 'inline' }}>{item.name}</Link>
							</MenuItem>;
					})}
				</Menu>
			</div>
		);
	}

}

