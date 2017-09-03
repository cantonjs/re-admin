
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
};

NavigatorSchema.defaultProps = {
	index: IndexView,
	login: LoginView,
	frame: FrameView,
	dataTable: DataTableView,
	notFound: NotFoundView,
};

NavigatorSchema.setConfig = ({ children }, navigator) => {
	const getChildren = (menu, keyPaths = []) => {
		const { children, ...other } = menu.props;
		const result = {
			...other,
			menuKey: other.path || `@${keyPaths.join('-')}`,
		};

		if (children) {
			result.children = Children.map(children, (child, index) =>
				getChildren(child, keyPaths.concat(index))
			);
		}

		return result;
	};

	navigator.menus = getChildren({ props: { children } }).children;
};
NavigatorSchema.schemaName = 'navigator';
NavigatorSchema.DataType = Object;
