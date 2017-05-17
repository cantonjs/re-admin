
import React from 'react';
import PropTypes from 'prop-types';

export default function AuthSchema() {
	return (<noscript />);
}

AuthSchema.propTypes = {
	basePath: PropTypes.string.isRequired,
	loginPath: PropTypes.string.isRequired,
	getUserPath: PropTypes.string.isRequired,
};

AuthSchema.setConfig = (props, auth) => {
	Object.assign(auth, props);
};

AuthSchema.schemaName = 'auth';
AuthSchema.DataType = Object;
