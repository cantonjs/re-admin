import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { pick } from 'lodash';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';
import Route from 'components/EnhancedRoute';

export default function NavigatorSchema() {
	return <noscript />;
}

NavigatorSchema.propTypes = {
	index: PropTypes.component,
	login: PropTypes.component,
	frame: PropTypes.component,
	dataTable: PropTypes.component,
	notFound: PropTypes.component,
};

NavigatorSchema.defaultProps = {
	index: IndexView,
	login: LoginView,
	frame: FrameView,
	dataTable: DataTableView,
	notFound: NotFoundView,
};

NavigatorSchema.setConfig = ({ children, ...other }, navigator) => {
	Object.assign(navigator, other);

	const { dataTable, index: welcome, notFound } = navigator;
	const breadcrumbNameMap = {};

	const getMenus = function getMenus(child, keyPaths = [], rootPath = '/') {
		const { children, ...props } = child.props;

		if (props.path) {
			props.path = (rootPath + props.path).replace(/\/\//, '/');
			props.menuKey = props.path;
			const { title: menuTitle, pageTitle } = props;
			const title = pageTitle || menuTitle;
			if (title && (props.table || props.component || props.render)) {
				breadcrumbNameMap[props.path] = {
					title,
					routeProps: pick(props, ['path', 'exact', 'strict']),
				};
			}
		} else {
			props.menuKey = `@${keyPaths.join('-')}`;
		}

		if (children) {
			props.children = Children.map(children, (child, index) =>
				getMenus(child, keyPaths.concat(index), props.path || rootPath)
			);
		}

		return props;
	};

	const getRoutes = function getRoutes(menus) {
		if (!menus || !menus.length) {
			return null;
		}

		return menus.map(({ children, ...route }, index) => {
			const props = { key: index, ...route };
			if (children) {
				return getRoutes(children);
			} else {
				if (!props.component && !props.render) {
					props.component = props.table ? dataTable : notFound;
				}
				return <Route {...props} />;
			}
		});
	};

	const getSlashesLength = function getSlashesLength(path) {
		return (path.match(/\//g) || []).length;
	};

	const menus = getMenus({ props: { children } }).children;
	const userRoutes = getRoutes(menus);
	const routes = [
		<Route key="_index" exact path="/" component={welcome} />,
		...userRoutes,
		<Route key="_notFound" component={notFound} />,
	];

	navigator.menus = menus;
	navigator.routes = routes;
	navigator.breadcrumbNameMap = Object.keys(breadcrumbNameMap)
		.sort((a, b) => getSlashesLength(a) - getSlashesLength(b))
		.reduce((acc, key) => {
			acc[key] = breadcrumbNameMap[key];
			return acc;
		}, {});
};

NavigatorSchema.schemaName = 'navigator';
NavigatorSchema.DataType = Object;
