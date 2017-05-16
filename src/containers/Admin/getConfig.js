
import jsxToPlainObject from 'utils/jsxToPlainObject';
import plainObjectToJsx from 'utils/plainObjectToJsx';
import { defaults } from 'lodash';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';

export default function getAppConfig(appConfig = {}) {
	const config = Object.assign({
		name: 'Admin',
		sidebar: [],
		router: [],
		views: {},
		api: {},
		auth: {},
		upload: {},
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
			query: [],
		});
		table.data = plainObjectToJsx(table.data);
		table.query = plainObjectToJsx(table.query);
		tables[key] = table;
		return tables;
	}, {});

	return config;
};
