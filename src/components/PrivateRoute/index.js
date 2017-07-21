
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...other }) => (
	<Route {...other} render={(props) => (
		fakeAuth.isAuthenticated ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/login',
				search: `?ref=${props.location.pathname + props.location.search}`,
			}}/>
		)
	)}/>
);

PrivateRoute.propTypes = {
	component: PropTypes.func.isRequired,
	location: PropTypes.object.isRequired,
};

export default PrivateRoute;
