import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import NaviEnhancer from './NaviEnhancer';

export default function EnhancedRoute(props) {
	const {
		component: Component,
		exact,
		strict,
		path,
		menuKey,
		...other
	} = props;
	const naviKey = menuKey || path || '*';
	return (
		<Route
			path={path}
			exact={exact}
			strict={strict}
			render={(matchProps) => (
				<NaviEnhancer {...other} path={path} naviKey={naviKey} key={naviKey}>
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
