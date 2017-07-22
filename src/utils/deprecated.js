
import { once } from 'lodash';

export default function deprecated({ outdated, replacement, message }) {
	return once(() => {
		console.warn(message ||
			`"${outdated}" has been deprecated, please use "${replacement}" instead.`
		);
	});
}
