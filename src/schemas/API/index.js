
import React from 'react';
import PropTypes from 'prop-types';

export default function APISchema() {
	return (<noscript />);
}

APISchema.propTypes = {
	baseURL: PropTypes.string.isRequired,
	timeout: PropTypes.number,
	count: PropTypes.number,
	accessTokenName: PropTypes.string,
	accessTokenLocation: PropTypes.oneOf(['header', 'query']),
};

APISchema.defaultProps = {
	timeout: 15000,
	count: 20,
	accessTokenName: 'X-ACCESS-TOKEN',
	accessTokenLocation: 'header',
};

APISchema.setConfig = (props, api) => {
	Object.assign(api, props);
};

APISchema.schemaName = 'api';
APISchema.DataType = Object;
