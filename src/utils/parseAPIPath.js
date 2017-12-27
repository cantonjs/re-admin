
import { isString, isObject } from 'lodash';
import { parse } from 'tiny-querystring';
import { parsePath } from 'history';

export default function parseAPIPath(apiPath) {
	if (isString(apiPath)) {
		apiPath = parsePath(apiPath);
		apiPath.query = apiPath.search.slice(1);
	}

	if (isObject(apiPath)) {
		if (isString(apiPath.query)) {
			apiPath.query = parse(apiPath.query);
		}

		if (apiPath.query === null) {
			apiPath.query = {};
		}

		return {
			pathname: '/',
			query: {},
			headers: {},
			...apiPath,
		};
	}

	throw new Error(
		'`apiPath` should be string or object, but received',
		typeof apiPath,
	);
}
