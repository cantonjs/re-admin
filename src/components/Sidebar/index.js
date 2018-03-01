import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import { Layout } from 'antd';
import AppTitle from 'components/AppTitle';
import Navi from 'components/Navi';

const { Sider } = Layout;

@observer
export default class Sidebar extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
	};

	_handleCollapse = (collapsed) => {
		panelsStore.updateSidebar(collapsed);
	};

	render() {
		const { context: { appConfig: { navigator: { menus }, logoNode } } } = this;
		const { isSidebarCollapsed } = panelsStore;
		return (
			<Sider
				collapsible
				collapsed={isSidebarCollapsed}
				onCollapse={this._handleCollapse}
				style={styles.container}
			>
				<div style={styles.title}>
					{logoNode}
					<AppTitle
						style={{
							width: isSidebarCollapsed ? 0 : 'auto',
							marginLeft: !isSidebarCollapsed && logoNode ? 8 : 0,
							opacity: isSidebarCollapsed ? 0 : 1,
							transition: 'opacity 0.2s',
						}}
					/>
				</div>
				<Navi menu={menus} />
			</Sider>
		);
	}
}
