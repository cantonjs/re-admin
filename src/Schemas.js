
const context = require.context('components', true, /index\.js$/);
context.keys().map((modulePath) => {
	const [, moduleName] = modulePath.split('/');
	const result = context(modulePath);
	const component = result.default || result;
	exports[moduleName] = component;
});
