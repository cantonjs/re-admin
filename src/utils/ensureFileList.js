import { isString, isArray, trim } from 'utils/fp';
import { isObservableArray } from 'mobx';

export default function ensureFileList(fileList = []) {
	if (isString(fileList)) {
		fileList = fileList.split(',');
	}

	if (!isArray(fileList) && !isObservableArray(fileList)) {
		throw new Error('`fileList` must be a string or array');
	}

	return fileList
		.map(trim)
		.filter(Boolean)
		.map((url, index) => ({
			uid: -index,
			url,
			name: url,
		}));
}
