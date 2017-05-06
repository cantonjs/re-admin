import './index.less';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import items from 'config/sidebar.js';
import { sidebar, name } from 'config/app.js';
// import {sidebarCollapseCreator} from '../../redux/Sidebar.js';


const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

export default class Sidebar extends Component {

	state = {
		openKeys: []
	};

	handleOpenChange(ev) {
		console.log(ev);
	};

	handleSelect(ev) {
		console.log(ev);
	};

	render() {
		return (
			<div>
				<div className="title">name</div>
				<Menu
					theme="dark"
					mode="inline"
					onOpenChange={this.handleOpenChange}
					onSelect={this.handleSelect}
					openKeys={this.state.openKeys}>
				</Menu>
			</div>
		);
	}

}

