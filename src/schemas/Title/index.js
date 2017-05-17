
import React from 'react';
import PropTypes from 'prop-types';

export default function TitleSchema() {
	return (<noscript />);
}

TitleSchema.propTypes = {
	children: PropTypes.string,
};

TitleSchema.defaultProps = {
	children: 'Admin',
};

TitleSchema.setConfig = ({ children }, _, config) => {
	config.title = children;
};

TitleSchema.schemaName = 'title';
TitleSchema.DataType = String;
