
import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import App from 'containers/App';
import Home from 'containers/Home';
import NotFound from 'containers/NotFound';
import getSidebar from 'utils/getSidebar';

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

export default function Root() {
	return (
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Home}/>
				{mapRoutes(getSidebar())}
				<Route path="*" component={NotFound}/>
			</Route>
		</Router>
	);
}
