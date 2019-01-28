import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { flatMap } from 'utils/fp';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import SetPasswordView from 'containers/SetPasswordView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';
import Route from 'components/EnhancedRoute';
import {
	CreaterFormDetailView,
	UpdaterFormDetailView,
} from 'containers/FormDetailViews';

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
	setPassword: PropTypes.component,
	frame: PropTypes.component,
	tableComponent: PropTypes.component,
	updaterComponent: PropTypes.component,
	createrComponent: PropTypes.component,
	notFound: PropTypes.component,
};

NavigatorSchema.defaultProps = {
	basename: '/',
	noBreadcrumb: false,
	noHomeBreadcrumb: false,
	noUserMenu: false,
	index: IndexView,
	login: LoginView,
	setPassword: SetPasswordView,
	frame: FrameView,
	tableComponent: DataTableView,
	updaterComponent: UpdaterFormDetailView,
	createrComponent: CreaterFormDetailView,
	notFound: NotFoundView,
};

NavigatorSchema.configuration = {
	name: 'navigator',
	propType: PropTypes.object,
	pipe({ children, ...other }) {
		Object.assign(this, other);

		const {
			tableComponent,
			updaterComponent,
			createrComponent,
			index: welcome,
			notFound,
			noBreadcrumb,
		} = this;

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

						const { title: menuTitle, pageTitle, breadcrumbTitle } = props;
						props.pageTitle = pageTitle || menuTitle;
						props.breadcrumbTitle = breadcrumbTitle || props.pageTitle;
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
			if (!menus || !menus.length) return [];

			return flatMap(menus, ({ children, ...route }, index) => {
				const props = { key: index, ...route };

				if (children) {
					return getRoutes(children);
				} else {
					const routes = [];
					const { table, path, breadcrumbTitle } = props;

					if (!props.component && !props.render) {
						props.component = table ? tableComponent : notFound;
					}

					if (table) {
						const breadcrumbParent = { path, breadcrumbTitle };
						const {
							updaterParams,
							createrParams,
							pageTitle, // prevent parent page title
							...restProps
						} = props;
						routes.push(
							<Route
								{...restProps}
								component={updaterComponent}
								{...updaterParams}
								breadcrumbParent={breadcrumbParent}
								path={`${path}/update/:key`}
							/>,
							<Route
								{...restProps}
								component={createrComponent}
								{...createrParams}
								breadcrumbParent={breadcrumbParent}
								path={`${path}/create/`}
							/>
						);
					}

					routes.push(<Route {...props} exact />);
					return routes;
				}
			});
		};

		const sidebarMenu = getMenu(sidebarChildren);
		const topMenu = getMenu(topChildren);
		const userRoutes = [...getRoutes(sidebarMenu), ...getRoutes(topMenu)];
		const routes = [
			<Route key="_index" exact path="/" menuKey="/" component={welcome} />,
			...userRoutes,
			<Route key="_notFound" component={notFound} />,
		];

		this.menus = sidebarMenu;
		this.topMenu = topMenu;
		this.routes = routes;
		return this;
	},
};
