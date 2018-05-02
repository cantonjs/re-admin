import { isValidElement } from 'react';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import plainObjectToJsx from 'utils/plainObjectToJsx';
import { defaults, isUndefined, isObject } from 'lodash';
import warning from 'warning';

const parseSchemaNodes = (nodes) => {
	const config = {};
	const parse = (nodes) => {
		if (isValidElement(nodes)) {
			if (!nodes.type || !isObject(nodes.type.schema)) {
				warning(false, `${nodes} is NOT a valid schema`);
			} else {
				const { name, pipe, initialData = {} } = nodes.type.schema;
				config[name] = isUndefined(config[name]) ? initialData : config[name];
				config[name] = pipe(nodes.props, config[name], config);
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

export default function getAppConfig(appConfig = {}) {
	appConfig = parseSchemaNodes(appConfig);

	const config = Object.assign(
		{
			title: 'Admin',
			navigator: {},
			api: {},
			auth: {},
			upload: {},
			tables: {},
			errorMessages: {},
			modals: new Map(),
		},
		jsxToPlainObject(appConfig)
	);

	config.api = defaults(config.api, {
		timeout: 15000,
		count: 20,
		accessTokenName: 'X-ACCESS-TOKEN',
		accessTokenLocation: 'header',
	});

	config.upload = defaults(config.upload, {
		imagePath: 'upload/image',
		imageSizeLimit: 3072,
		filePath: 'upload/file',
		fileSizeLimit: 10240,
		strategies: {},
		requireAccessToken: false,
	});

	config.tables = Object.keys(config.tables).reduce((tables, key) => {
		const table = defaults(config.tables[key] || {}, {
			data: [],
		});
		table.data = plainObjectToJsx(table.data);
		tables[key] = table;
		return tables;
	}, {});

	return config;
}
