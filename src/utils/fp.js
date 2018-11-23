export const isUndefined = (t) => typeof t === 'undefined';
export const isFunction = (t) => typeof t === 'function';
export const isString = (t) => typeof t === 'string';
export const isNumber = (t) => typeof t === 'number';
export const isObject = (t) => t && typeof t === 'object';
export const isArray = (t) => t instanceof Array;
export const isEmpty = (t) =>
	!t || (isArray(t) ? !t.length : isObject(t) && !Object.keys(t).length);

export const assign = (src, ...args) =>
	args.reduce((ret, arg) => ({ ...ret, ...arg }), src);

export const defaults = (src, target) => ({ ...target, ...src });

export const map = (obj, each) =>
	Object.keys(obj).map((k) => each(obj[k], k, obj));

export const reduce = (obj, each, init) =>
	map(obj, (...args) => args).reduce((ret, args) => each(ret, ...args), init);

export const omitBy = (obj, by) =>
	reduce(obj, (ret, v, k) => (by(v, k) ? ret : { ...ret, [k]: v }), {});

export const omit = (obj, arr) => omitBy(obj, (v, k) => ~arr.indexOf(k));

export const flatMap = (arr, each) =>
	arr.reduce((flat, ...args) => flat.concat(each(...args)), []);

export const trim = (str) =>
	str
		.toString()
		.replace(/^\s+/, '')
		.replace(/\s+$/, '');
