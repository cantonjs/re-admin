const stateKeys = [
	'record',
	'value',
	'index',
	'name',
	'key',
	'component',
	'Component',
	'text',
];

export default function createRendererState(store, options) {
	const proxy = {};
	stateKeys.forEach((key) => {
		Object.defineProperty(proxy, key, {
			get() {
				if (key === 'text') key = 'value';
				else if (key === 'component') key = 'Component';
				if (store.hasOwnProperty(key)) return store[key];
				if (options.hasOwnProperty(key)) return options[key];
				if (key === 'record') return store.record || {};
				if (key === 'value') return proxy.record[proxy.key];
				if (key === 'index') return 0;
			},
		});
	});
	return proxy;
}
