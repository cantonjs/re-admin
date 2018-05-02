import React from 'react';
import PropTypes from 'prop-types';

export default function FooterSchema() {
	return <noscript />;
}

FooterSchema.propTypes = {
	children: PropTypes.node,
};

FooterSchema.configuration = {
	pipe: ({ children }) => children,
	name: 'footer',
	initialData: null,
};
