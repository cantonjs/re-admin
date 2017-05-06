
import Store from 'stores/Data';

const caches = {};

export default function getStore(tableKey) {
	if (caches[tableKey]) { return caches[tableKey]; }

	try {
		const context = require.context('config/schemas', true, /\.js$/);
		const schema = context(`./${tableKey}/data.js`);
		const store = new Store(schema);
		caches[tableKey] = store;
		return store;
	}
	catch (err) {
		console.error(`找不到 "${tableKey}" 相关的 schema`);
		throw err;
	}
}
