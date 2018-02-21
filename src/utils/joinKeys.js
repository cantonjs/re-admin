import { isObservableArray } from 'mobx';
import { isString, isArray } from 'lodash';
import warning from 'warning';

export default function joinKeys(keys, type = 'CSV') {
	if (!keys) {
		return '';
	}
	if (isString(keys)) {
		return keys;
	}

	if (type === 'CSV') {
		if (isArray(keys) || isObservableArray(keys)) {
			return keys.join(',');
		}
	} else {
		warning(false, `Joining keys with "${type}" is not supported`);
	}

	return '';
}
