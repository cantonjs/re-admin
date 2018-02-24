import React from 'react';
import PropTypes from 'prop-types';

export default function FooterSchema() {
	return <noscript />;
}

FooterSchema.propTypes = {
	children: PropTypes.string,
};

FooterSchema.defaultProps = {
	children: 'Admin',
};

FooterSchema.setConfig = ({ children }, _, config) => {
	config.footer = children;
};

FooterSchema.schemaName = 'footer';
FooterSchema.DataType = String;
