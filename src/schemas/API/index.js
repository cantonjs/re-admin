
import React from 'react';
import PropTypes from 'prop-types';

export default function APISchema() {
	return (<noscript />);
}

APISchema.propTypes = {
	baseURL: PropTypes.string.isRequired,
	timeout: PropTypes.number,
	count: PropTypes.number,
};

APISchema.defaultProps = {
	timeout: 15000,
	count: 20,
};

APISchema.setConfig = (props, api) => {
	Object.assign(api, props);
};

APISchema.schemaName = 'api';
APISchema.DataType = Object;
