import { isValidElement } from 'react';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { isUndefined, isObject, isFunction } from 'utils/fp';
import warning from 'warning';
import * as SchemaComponents from 'schemas';

const isNotEmpty = function isNotEmpty(object) {
	if (!object) return false;
	if (Array.isArray(object)) return !!object.length;
	for (let i in object) return true;
	return false;
};

const parseSchemaNodes = (nodes, defaults) => {
	const config = {};
	const parse = (nodes) => {
		if (isValidElement(nodes)) {
			const component = nodes.type;
			if (!component || !isObject(component.configuration)) {
				warning(false, `${nodes} is NOT a valid schema`);
			} else {
				const { name, pipe } = component.configuration;
				const ctx = isUndefined(config[name]) ? defaults[name] : config[name];
				config[name] = pipe.call(ctx, nodes.props, ctx, config);
			}
			return config;
		} else if (Array.isArray(nodes)) {
			nodes.forEach(parse);
			return config;
		} else {
			return nodes;
		}
	};
	return parse(nodes);
};

// eslint-disable-next-line
const mapComponent = (key) => SchemaComponents[key];
const valid = (component) => component.configuration;
const components = Object.keys(SchemaComponents)
	.map(mapComponent)
	.filter(valid);

export const configShape = components.reduce((shape, { configuration }) => {
	const { propType, name } = configuration;
	if (propType) shape[name] = propType;
	return shape;
}, {});

export function getAppConfig(props) {
	const { config: configProp, children, ...other } = props;
	const config = {};
	components.forEach((component) => {
		const { defaultProps, configuration: { initialData, name } } = component;
		config[name] = (function () {
			if (isFunction(initialData)) return initialData();
			if (!isUndefined(initialData)) return initialData;
			if (defaultProps) return { ...defaultProps };
			return {};
		})();
	});
	const assignArgs = [];
	if (isNotEmpty(configProp)) assignArgs.push(configProp);
	if (isNotEmpty(children)) assignArgs.push(parseSchemaNodes(children, config));
	if (isNotEmpty(other)) assignArgs.push(other);
	if (assignArgs.length) {
		Object.assign(config, jsxToPlainObject(Object.assign({}, ...assignArgs)));
	}
	return config;
}
