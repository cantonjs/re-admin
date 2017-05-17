
import { isValidElement } from 'react';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import plainObjectToJsx from 'utils/plainObjectToJsx';
import { defaults, isFunction } from 'lodash';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';

const parseSchemaNodes = (nodes) => {
	const config = {};
	const parse = (nodes) => {
		if (isValidElement(nodes)) {
			if (!nodes.type || !isFunction(nodes.type.setConfig)) {
				console.error(`${nodes} is NOT a valid schema`);
			}
			else {
				const { DataType, schemaName, setConfig } = nodes.type;
				config[schemaName] = config[schemaName] || new DataType();
				setConfig(nodes.props, config[schemaName], config);
			}
			return config;
		}
		else if (Array.isArray(nodes)) {
			nodes.forEach(parse);
			return config;
		}
		else {
			return nodes;
		}
	};
	return parse(nodes);
};

export default function getAppConfig(appConfig = {}) {
	appConfig = parseSchemaNodes(appConfig);
	console.log('appConfig', appConfig);

	const config = Object.assign({
		title: 'Admin',
		sidebar: [],
		router: [],
		views: {},
		api: {},
		auth: {},
		upload: {},
		tables: {},
	}, jsxToPlainObject(appConfig));

	config.views = defaults(config.views, {
		index: IndexView,
		login: LoginView,
		dataTable: DataTableView,
		notFound: NotFoundView,
		frame: FrameView,
	});

	config.sidebar = (function () {
		const { dataTable, notFound } = config.views;
		const mergeItem = (children) => children.map((child, index) => {
			if (child.children) { mergeItem(child.children); }
			else if (!child.component) {
				child.component = child.table ? dataTable : notFound;
			}
			child.key = index;
			return child;
		});

		return mergeItem(config.sidebar);
	}());

	config.api = defaults(config.api, {
		timeout: 15000,
		count: 20,
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
			title: key,
		});
		table.data = plainObjectToJsx(table.data);
		tables[key] = table;
		return tables;
	}, {});

	return config;
};
