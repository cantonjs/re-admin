import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function MenuSchema() {
	return <noscript />;
}

MenuSchema.propTypes = {
	title: PropTypes.string.isRequired, // menu title
	pageTitle: PropTypes.string, // page title, will use `title` fallback
	breadcrumbTitle: PropTypes.string, // breadcrumb title, will use `pageTitle` fallback
	icon: PropTypes.string,
	path: PropTypes.string,
	table: PropTypes.string,
	top: PropTypes.bool,
	children: PropTypes.node,
	component: PropTypes.component,
	header: PropTypes.component,
	footer: PropTypes.component,
	toolbar: PropTypes.component,
	updaterParams: PropTypes.object,
	createrParams: PropTypes.object,
};

MenuSchema.defaultProps = {
	top: false,
};
