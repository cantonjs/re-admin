
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { defaults } from 'lodash';
import appConfig from 'config/app';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';

let cache;

export default function getAppConfig() {
	if (cache) { return cache; }

	const config = defaults(jsxToPlainObject(appConfig), {
		name: 'Admin',
		sidebar: [],
		router: [],
		views: {},
		api: {},
		auth: {},
		upload: {},
	});

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

	return (cache = config);
};
