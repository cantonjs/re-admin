
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { memoize } from 'lodash';
import appConfig from 'config/app';

export default memoize(function getAppConfig() {
	return jsxToPlainObject(appConfig);
});
