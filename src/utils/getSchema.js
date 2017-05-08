
export default function getSchema(tableKey, type = 'data') {
	try {
		const context = require.context('config/schemas', true, /\.js$/);
		const result = context(`./${tableKey}/${type}.js`);
		return result.default || result;
	}
	catch (err) {
		console.error(`找不到 "${tableKey}" 相关的 schema`);
		throw err;
	}
}
