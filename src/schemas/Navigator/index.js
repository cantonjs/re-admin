
import React, { isValidElement } from 'react';
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
	const getChildren = (children) => {
		if (Array.isArray(children)) {
			return children.map(getChildren);
		}
		else if (isValidElement(children)) {
			const { children: sub, ...props } = children.props;
			return sub ? {
				children: [].concat(getChildren(sub)),
				...props,
			} : props;
		}
		return children;
	};

	navigator.menus = navigator.menus || [];
	navigator.menus.push(...getChildren(children).filter(Boolean));
};
NavigatorSchema.schemaName = 'navigator';
NavigatorSchema.DataType = Object;
