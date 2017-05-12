
export default function getSchema(tableKey, type = 'data', fallback) {
	try {
		const context = require.context('config/schemas', true, /\.js$/);
		const result = context(`./${tableKey}/${type}.js`);
		return result.default || result;
	}
	catch (err) {
		if (fallback) { return fallback; }

		console.error(`找不到 "${tableKey}" 相关的 schema`);
		throw err;
	}
}
