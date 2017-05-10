
import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from 'containers/App';
import Home from 'containers/Home';
import Login from 'containers/Login';
import NotFound from 'containers/NotFound';
import getSidebar from 'utils/getSidebar';
import authStore from 'stores/auth';

const mapRoutes = (routes) => {
	if (!routes || !routes.length) { return null; }

	return routes.map(({ children, ...route }, index) => {
		return (
			<Route {...route} key={index}>
				{mapRoutes(children)}
				<Route path="*" component={NotFound}/>
			</Route>
		);
	});
};

const onEnter = async (nextState, replace, next) => {
	const { pathname, search } = nextState.location;
	const isOk = await authStore.auth();
	if (!isOk) {
		replace({
			pathname: '/login',
			query: {
				// ref: encodeURIComponent(pathname + search),
				ref: pathname + search,
			},
		});
	}
	next();
};

export default class Root extends Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="login" component={Login} />
				<Route path="/" component={App} onEnter={onEnter}>
					<IndexRoute component={Home}/>
					{mapRoutes(getSidebar())}
					<Route path="*" component={NotFound}/>
				</Route>
			</Router>
		);
	}
}
