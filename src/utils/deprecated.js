const cache = new Set();

export default function deprecated(name, replacement, message) {
	if (cache.has(name)) {
		return;
	}
	cache.add(name);
	console.warn(
		message ||
			`"${name}" has been deprecated, please use "${replacement}" instead.`
	);
}
