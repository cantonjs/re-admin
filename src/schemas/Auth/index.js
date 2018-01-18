import React from 'react';
import PropTypes from 'prop-types';
import { returnsArgument } from 'empty-functions';

export default function AuthSchema() {
	return <noscript />;
}

AuthSchema.propTypes = {
	basePath: PropTypes.string.isRequired,
	loginPath: PropTypes.string.isRequired,
	getUserPath: PropTypes.string.isRequired,
	defaultLoginRedirection: PropTypes.string,
	mapOnLoginResponse: PropTypes.func,
	mapOnGetUserResponse: PropTypes.func,
};

AuthSchema.defaultProps = {
	defaultLoginRedirection: '/',
	mapOnLoginResponse: returnsArgument,
	mapOnGetUserResponse: returnsArgument,
};

AuthSchema.setConfig = (props, auth) => {
	Object.assign(auth, props);
};

AuthSchema.schemaName = 'auth';
AuthSchema.DataType = Object;
