import cookie from 'cookie';

export default {
	set(name, value, options) {
		return (document.cookie = cookie.serialize(name, value, options));
	},
	get(name) {
		return cookie.parse(document.cookie)[name];
	},
	remove(name, options = {}) {
		options.expires = new Date(0);
		return !!(document.cookie = cookie.serialize(name, '', options));
	},
};
