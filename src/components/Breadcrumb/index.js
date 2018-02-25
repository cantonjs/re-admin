import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import { map } from 'lodash';
import { Breadcrumb as AntdBreadcrumb, Icon } from 'antd';
import { Link, matchPath } from 'react-router-dom';

const { Item } = AntdBreadcrumb;

@observer
export default class Breadcrumb extends Component {
	static contextTypes = {
		appConfig: PropTypes.object,
	};

	_renderItems(breadcrumbNameMap) {
		const { pathname } = routerStore.location;
		const items = map(breadcrumbNameMap, ({ routeProps, title }) => {
			if (matchPath(pathname, routeProps)) {
				return { title, path: routeProps.path };
			}
		});
		const max = items.length - 1;
		return items.filter(Boolean).map(({ title, path }, index) => {
			if (index >= max) {
				return (
					<Item key={title}>
						<Link to={path}>{title}</Link>
					</Item>
				);
			}
			return <Item key={title}>{title}</Item>;
		});
	}

	render() {
		const {
			noBreadcrumb,
			noHomeBreadcrumb,
			breadcrumbNameMap,
		} = this.context.appConfig.navigator;
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
				{this._renderItems(breadcrumbNameMap)}
			</AntdBreadcrumb>
		);
	}
}
