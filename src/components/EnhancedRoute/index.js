import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';

export default function EnhancedRoute({
	component: Component,
	exact,
	strict,
	path,
	...other
}) {
	return (
		<Route
			path={path}
			exact={exact}
			strict={strict}
			render={(matchProps) => <Component {...matchProps} {...other} />}
		/>
	);
}

EnhancedRoute.propTypes = {
	component: PropTypes.any.isRequired,
	exact: PropTypes.any,
	strict: PropTypes.any,
	path: PropTypes.any,
};
