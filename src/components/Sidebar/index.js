import './style.scss';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import items from 'config/sidebar.js';
import { sidebar, name } from 'config/app.js';
// import {sidebarCollapseCreator} from '../../redux/Sidebar.js';


const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const MenuItemGroup = Menu.ItemGroup;

export default class Sidebar extends Component {

	state = {
		openKeys: []
	};

	handleClick = (e) => {
		console.log('click ', e);
	}

	render() {
		return (
			<div className="container">
				<div className="title">{name}</div>
				<Menu
					onClick={this.handleClick}
					style={{ width: 240 }}
					defaultSelectedKeys={['1']}
					defaultOpenKeys={['sub1']}
					mode="inline"
					>
					<SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
					<MenuItemGroup key="g1" title="Item 1">
					<MenuItem key="1">Option 1</MenuItem>
					<MenuItem key="2">Option 2</MenuItem>
					</MenuItemGroup>
					<MenuItemGroup key="g2" title="Item 2">
					<MenuItem key="3">Option 3</MenuItem>
					<MenuItem key="4">Option 4</MenuItem>
					</MenuItemGroup>
					</SubMenu>
					<SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
					<MenuItem key="5">Option 5</MenuItem>
					<MenuItem key="6">Option 6</MenuItem>
					<SubMenu key="sub3" title="Submenu">
					<MenuItem key="7">Option 7</MenuItem>
					<MenuItem key="8">Option 8</MenuItem>
					</SubMenu>
					</SubMenu>
					<SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
					<MenuItem key="9">Option 9</MenuItem>
					<MenuItem key="10">Option 10</MenuItem>
					<MenuItem key="11">Option 11</MenuItem>
					<MenuItem key="12">Option 12</MenuItem>
					</SubMenu>
				</Menu>
			</div>
		);
	}

}

