
import { isObservableArray } from 'mobx';
import { isString, isArray } from 'lodash';

export default function joinKeys(keys, type = 'CSV') {
	if (!keys) { return ''; }
	if (isString(keys)) { return keys; }

	if (type === 'CSV') {
		if (isArray(keys) || isObservableArray(keys)) {
			return keys.join(',');
		}
	}
	else {
		console.error(`Joining keys with "${type}" is not supported`);
	}

	return '';
}
