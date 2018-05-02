import React, { Children } from 'react';
import PropTypes from 'prop-types';

export default function LogoSchema() {
	return <noscript />;
}

LogoSchema.propTypes = {
	children: PropTypes.node,
};

LogoSchema.configuration = {
	name: 'logoNode',
	propType: PropTypes.node,
	pipe: ({ children }) => Children.only(children),
	initialData: null,
};
