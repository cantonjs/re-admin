import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function MenuSchema() {
	return <noscript />;
}

MenuSchema.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
	path: PropTypes.string,
	table: PropTypes.string,
	top: PropTypes.bool,
	children: PropTypes.node,
	component: PropTypes.component,
	header: PropTypes.component,
	footer: PropTypes.component,
};

MenuSchema.defaultProps = {
	top: false,
};
