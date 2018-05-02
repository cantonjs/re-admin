import React from 'react';
import PropTypes from 'prop-types';

export default function FooterSchema() {
	return <noscript />;
}

FooterSchema.propTypes = {
	children: PropTypes.node,
};

FooterSchema.configuration = {
	name: 'footer',
	propType: PropTypes.node,
	pipe: ({ children }) => children,
	initialData: null,
};
