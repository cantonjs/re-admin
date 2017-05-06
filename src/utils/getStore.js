
// TODO: only for developing...
import stores from 'stores/testStore';

export default function getStore(tableKey) {
	try {
		const context = require.context('config/schemas', true, /\.js$/);
		const schema = context(`./${tableKey}/data.js`);
		console.log('schema', schema);
	}
	catch (err) {
		console.error(`找不到 "${tableKey}" 相关的 schema`);
	}

	return stores;
}
