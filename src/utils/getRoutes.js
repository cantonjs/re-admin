
import React from 'react';
import { Route } from 'react-router';

let cache;

export default function getRoutes({ views, sidebar }) {
	const mapRoutes = (routes) => {
		if (!routes || !routes.length) { return null; }

		return routes.map(({ children, ...route }, index) =>
			<Route {...route} key={index}>
				{mapRoutes(children)}
				<Route path="*" component={views.notFound}/>
			</Route>
		);
	};

	return cache || (cache = mapRoutes(sidebar));
}
