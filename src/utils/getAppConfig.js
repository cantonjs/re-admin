
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { memoize, defaults } from 'lodash';
import appConfig from 'config/app';

const getAppConfig = memoize(function () {
	const config = defaults(jsxToPlainObject(appConfig), {
		api: {},
		auth: {},
		upload: {},
	});

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

	return config;
});

export default getAppConfig;
