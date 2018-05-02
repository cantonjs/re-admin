import React from 'react';
import PropTypes from 'prop-types';

export default function APISchema() {
	return <noscript />;
}

APISchema.propTypes = {
	baseURL: PropTypes.string.isRequired,
	timeout: PropTypes.number,
	count: PropTypes.number,
	accessTokenName: PropTypes.string,
	accessTokenLocation: PropTypes.oneOf(['headers', 'header', 'query']),
	sortKey: PropTypes.string,
	orderKey: PropTypes.string,
	descValue: PropTypes.string,
	ascValue: PropTypes.string,
};

APISchema.defaultProps = {
	timeout: 15000,
	count: 20,
	accessTokenName: 'X-ACCESS-TOKEN',
	accessTokenLocation: 'header',
	sortKey: 'sort',
	orderKey: 'order',
	descValue: 'desc',
	ascValue: 'asc',
};

APISchema.schema = {
	pipe: ({ accessTokenLocation, ...props }, api) => {
		return Object.assign(api, props, {
			accessTokenLocation:
				accessTokenLocation !== 'query' ? 'headers' : 'query',
		});
	},
	name: 'api',
};
