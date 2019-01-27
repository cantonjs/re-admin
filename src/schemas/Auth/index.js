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
	crypto: PropTypes.func,
	mapOnLoginRequestBody: PropTypes.func,
	mapOnLoginResponse: PropTypes.func,
	mapOnGetUserResponse: PropTypes.func,
};

AuthSchema.defaultProps = {
	defaultLoginRedirection: '/',
	mapOnLoginRequestBody: returnsArgument,
	mapOnLoginResponse: returnsArgument,
	mapOnGetUserResponse: returnsArgument,
};

AuthSchema.configuration = {
	name: 'auth',
	propType: PropTypes.object,
	pipe: (props, auth) => Object.assign(auth, props),
};
