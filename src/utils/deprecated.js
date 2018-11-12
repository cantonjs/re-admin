import warning from 'warning';

const cache = new WeakSet();

export default function deprecated(fn, message) {
	return (...args) => {
		if (!cache.has(fn)) {
			cache.add(fn);
			warning(false, message || `${fn.name} is deprecated.`);
		}
		return fn(...args);
	};
}
