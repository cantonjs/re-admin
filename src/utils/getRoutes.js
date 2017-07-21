
import React from 'react';
import { Route } from 'react-router-dom';

let cache;

export default function getRoutes({ navigator }, match) {

	const mapRoutes = (menus, url) => {
		if (!menus || !menus.length) { return null; }

		return menus.map(({ children, path, ...route }, index) => {
			const props = { key: index, ...route };
			if (path) {
				props.path = url ? (url + path).replace(/\/\//, '/') : path;
			}
			return children ? mapRoutes(children, props.path) : <Route {...props} />;
		});
	};

	return cache || (cache = mapRoutes(navigator.menus, match.url));
}
