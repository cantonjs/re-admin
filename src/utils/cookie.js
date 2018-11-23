import cookie from 'cookie';
import { defaults } from 'utils/fp';

export default {
	set(name, value, options = {}) {
		defaults(options, { path: '/' });
		return (document.cookie = cookie.serialize(name, value, options));
	},
	get(name) {
		return cookie.parse(document.cookie)[name];
	},
	remove(name, options = {}) {
		options = defaults(options, { path: '/' });
		options.expires = new Date(0);
		return !!(document.cookie = cookie.serialize(name, '', options));
	},
};
