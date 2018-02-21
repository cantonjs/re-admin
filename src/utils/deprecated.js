import warning from 'warning';

const cache = new Set();

export default function deprecated(name, replacement, message) {
	if (cache.has(name)) {
		return;
	}
	cache.add(name);
	warning(
		false,
		message ||
			`"${name}" has been deprecated, please use "${replacement}" instead.`
	);
}
