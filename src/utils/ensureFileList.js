
import { isString, isArray, trim } from 'lodash';

export default function ensureFileList(fileList = []) {
	if (isString(fileList)) {
		fileList = fileList.split(',');
	}

	if (!isArray(fileList)) {
		throw new Error('`fileList` must be a string or array');
	}

	return fileList
		.map(trim)
		.filter(Boolean)
		.map((url, index) => ({
			uid: -index,
			url,
			name: url,
		}))
	;
}
