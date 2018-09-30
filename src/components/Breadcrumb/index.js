import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import naviStore from 'stores/naviStore';
import { Breadcrumb as AntdBreadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Item } = AntdBreadcrumb;

@observer
export default class Breadcrumb extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
	};

	_renderItems() {
		const getBreadcrumbItem = (state = {}, items = []) => {
			const { breadcrumbTitle, path, breadcrumbParent } = state;
			if (breadcrumbTitle && path) {
				items.unshift(
					<Item key={path}>
						{items.length ? (
							<Link to={path}>{breadcrumbTitle}</Link>
						) : (
							breadcrumbTitle
						)}
					</Item>
				);
				return getBreadcrumbItem(breadcrumbParent, items);
			}
			return items;
		};
		return getBreadcrumbItem(naviStore.state);
	}

	render() {
		const { noBreadcrumb, noHomeBreadcrumb } = this.context.appConfig.navigator;
		if (noBreadcrumb) {
			return null;
		}
		return (
			<AntdBreadcrumb {...this.props}>
				{!noHomeBreadcrumb && (
					<Item>
						<Link to="/">
							<Icon type="home" />
						</Link>
					</Item>
				)}
				{this._renderItems()}
			</AntdBreadcrumb>
		);
	}
}
