import React, { Children } from 'react';
import PropTypes from 'prop-types';

export default function LogoSchema() {
	return <noscript />;
}

LogoSchema.propTypes = {
	children: PropTypes.node,
};

LogoSchema.schema = {
	pipe: ({ children }) => Children.only(children),
	name: 'logoNode',
	initialConfig: null,
};
