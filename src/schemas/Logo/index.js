import React, { Children } from 'react';
import PropTypes from 'prop-types';

export default function LogoSchema() {
	return <noscript />;
}

LogoSchema.propTypes = {
	children: PropTypes.node,
};

LogoSchema.setConfig = ({ children }, _, config) => {
	config.logoNode = Children.only(children);
};

LogoSchema.schemaName = 'logo';
LogoSchema.DataType = Object;
