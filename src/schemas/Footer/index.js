import React from 'react';
import PropTypes from 'prop-types';

export default function FooterSchema() {
	return <noscript />;
}

FooterSchema.propTypes = {
	children: PropTypes.node,
};

FooterSchema.defaultProps = {
	children: 'Admin',
};

FooterSchema.schema = {
	pipe: ({ children }) => children,
	name: 'footer',
	initialConfig: null,
};
