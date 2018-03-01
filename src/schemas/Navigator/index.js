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
	basename: PropTypes.string,
	noBreadcrumb: PropTypes.bool,
	noHomeBreadcrumb: PropTypes.bool,
	noUserMenu: PropTypes.bool,
	index: PropTypes.component,
	login: PropTypes.component,
	frame: PropTypes.component,
	dataTable: PropTypes.component,
	notFound: PropTypes.component,
};

NavigatorSchema.defaultProps = {
	basename: '/',
	noBreadcrumb: false,
	noHomeBreadcrumb: false,
	noUserMenu: false,
	index: IndexView,
	login: LoginView,
	frame: FrameView,
	dataTable: DataTableView,
	notFound: NotFoundView,
};

NavigatorSchema.setConfig = ({ children, ...other }, navigator) => {
	Object.assign(navigator, other);

	const { dataTable, index: welcome, notFound, noBreadcrumb } = navigator;
	const breadcrumbNameMap = {};

	const sidebarChildren = [];
	const topChildren = [];

	Children.toArray(children).forEach((child) => {
		if (child.props.top) {
			topChildren.push(child);
		} else {
			sidebarChildren.push(child);
		}
	});

	const getMenu = function getMenu(children) {
		const next = function next(child, keyPaths = [], rootPath = '/') {
			const { children, ...props } = child.props;
			let nextRootPath = rootPath;

			props.isInternalPath = !/^https?:\/\//i.test(props.path);

			if (props.path) {
				if (props.isInternalPath) {
					props.path = (rootPath + props.path).replace(/\/\//, '/');
					nextRootPath = props.path;

					const { title: menuTitle, pageTitle } = props;
					const title = pageTitle || menuTitle;
					if (
						!noBreadcrumb &&
						title &&
						(props.table || props.component || props.render)
					) {
						breadcrumbNameMap[props.path] = {
							title,
							routeProps: pick(props, ['path', 'exact', 'strict']),
						};
					}
				}

				props.menuKey = props.path;
			} else {
				props.menuKey = `@${keyPaths.join('-')}`;
			}

			if (children) {
				props.children = Children.map(children, (child, index) =>
					next(child, keyPaths.concat(index), nextRootPath)
				);
			}

			return props;
		};

		return next({ props: { children } }).children;
	};

	const getRoutes = function getRoutes(menus) {
		if (!menus || !menus.length) {
			return [];
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

	const sidebarMenu = getMenu(sidebarChildren);
	const topMenu = getMenu(topChildren);
	const userRoutes = [...getRoutes(sidebarMenu), ...getRoutes(topMenu)];
	const routes = [
		<Route key="_index" exact path="/" component={welcome} />,
		...userRoutes,
		<Route key="_notFound" component={notFound} />,
	];

	navigator.menus = sidebarMenu;
	navigator.topMenu = topMenu;
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
