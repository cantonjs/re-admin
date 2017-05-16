
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { defaults } from 'lodash';
import appConfig from 'config/app';
import DataTable from 'containers/DataTable';
import NotFound from 'containers/NotFound';

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

	config.sidebar = (function () {
		const mergeItem = (children) => children.map((child, index) => {
			if (child.children) { mergeItem(child.children); }
			else if (!child.component) {
				child.component = child.table ? DataTable : NotFound;
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
