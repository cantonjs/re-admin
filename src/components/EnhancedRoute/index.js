import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import NaviEnhancer from './NaviEnhancer';

export default function EnhancedRoute(props) {
	const { component: Component, exact, strict, ...other } = props;
	const { path, menuKey } = other;
	const keyProps = menuKey ? { key: menuKey } : {};
	return (
		<Route
			path={path}
			exact={exact}
			strict={strict}
			render={(matchProps) => (
				<NaviEnhancer {...other} path={path} {...keyProps}>
					<Component {...matchProps} />
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
