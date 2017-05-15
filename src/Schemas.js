
const { getSchemaComponents } = require('utils/getComponent');

getSchemaComponents().forEach((name) => {
	exports[name] = name;
});
