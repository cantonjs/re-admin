
const context = require.context('components', true, /index\.js$/);
context.keys().map((modulePath) => {
	const [, moduleName] = modulePath.split('/');
	const result = context(modulePath);
	exports[moduleName] = result.default || result;
});
