
import React from 'react';
import { Route } from 'react-router';
import getSidebar from 'utils/getSidebar';
import getAppConfig from 'utils/getAppConfig';
import NotFound from 'containers/NotFound';

const mapRoutes = (routes) => {
	if (!routes || !routes.length) { return null; }

	return routes.map(({ children, ...route }, index) =>
		<Route {...route} key={index}>
			{mapRoutes(children)}
			<Route path="*" component={getAppConfig().views.notFound || NotFound}/>
		</Route>
	);
};

let cache;

export default function getRoutes() {
	return cache || (cache = mapRoutes(getSidebar()));
}
