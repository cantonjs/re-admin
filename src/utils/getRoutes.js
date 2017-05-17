
import React from 'react';
import { Route } from 'react-router';

let cache;

export default function getRoutes({ navigator }) {
	const mapRoutes = (menus) => {
		if (!menus || !menus.length) { return null; }

		return menus.map(({ children, ...route }, index) =>
			<Route {...route} key={index}>
				{!!children && mapRoutes(children)}
				{!!children &&
					<Route path="*" component={navigator.notFound}/>
				}
			</Route>
		);
	};

	return cache || (cache = mapRoutes(navigator.menus));
}
