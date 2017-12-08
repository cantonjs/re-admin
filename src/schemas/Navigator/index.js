
import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';

export default function NavigatorSchema() {
	return (<noscript />);
}

NavigatorSchema.propTypes = {
	index: PropTypes.component,
	login: PropTypes.component,
	frame: PropTypes.component,
	dataTable: PropTypes.component,
	notFound: PropTypes.component,
	routerActionKeyPrefix: PropTypes.string,
};

NavigatorSchema.defaultProps = {
	index: IndexView,
	login: LoginView,
	frame: FrameView,
	dataTable: DataTableView,
	notFound: NotFoundView,
	routerActionKeyPrefix: 'opt_',
};

NavigatorSchema.setConfig = ({ children, ...other }, navigator) => {
	const getChildren = (menu, keyPaths = []) => {
		const { children, ...otherMenuProps } = menu.props;
		const result = {
			...otherMenuProps,
			menuKey: otherMenuProps.path || `@${keyPaths.join('-')}`,
		};

		if (children) {
			result.children = Children.map(children, (child, index) =>
				getChildren(child, keyPaths.concat(index))
			);
		}

		return result;
	};

	Object.assign(navigator, other, {
		menus: getChildren({ props: { children } }).children,
	});
};
NavigatorSchema.schemaName = 'navigator';
NavigatorSchema.DataType = Object;
