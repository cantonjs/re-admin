
import { isString, isObject } from 'lodash';
import url from 'url';
import { parse } from 'utils/qs';

export default function parseAPIPath(apiPath) {
	if (isString(apiPath)) {
		apiPath = url.parse(apiPath);
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
