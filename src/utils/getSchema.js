
const caches = {};

export default function getStore(tableKey, type = 'data') {
	if (caches[tableKey]) { return caches[tableKey]; }

	try {
		const context = require.context('config/schemas', true, /\.js$/);
		const schema = context(`./${tableKey}/${type}.js`);
		caches[tableKey] = schema;
		return schema;
	}
	catch (err) {
		console.error(`找不到 "${tableKey}" 相关的 schema`);
		throw err;
	}
}
