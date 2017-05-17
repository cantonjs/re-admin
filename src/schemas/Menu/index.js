
import React from 'react';
import PropTypes from 'utils/PropTypes';

export default function MenuSchema() {
	return (<noscript />);
}

MenuSchema.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
	path: PropTypes.string,
	component: PropTypes.component,
	table: PropTypes.string,
	children: PropTypes.node,
};
