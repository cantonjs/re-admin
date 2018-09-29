import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import NaviEnhancer from './NaviEnhancer';

export default function EnhancedRoute({
	component: Component,
	exact,
	strict,
	path,
	menuKey,
	...other
}) {
	const key = menuKey || path || '*';
	return (
		<Route
			path={path}
			exact={exact}
			strict={strict}
			render={(matchProps) => (
				<NaviEnhancer menuKey={key} key={key}>
					<Component {...matchProps} {...other} />
				</NaviEnhancer>
			)}
		/>
	);
}

EnhancedRoute.propTypes = {
	component: PropTypes.any.isRequired,
	exact: PropTypes.any,
	strict: PropTypes.any,
	path: PropTypes.any,
	menuKey: PropTypes.string,
};
