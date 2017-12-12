
import { RequestExtra } from 'fetch-extra';
import { isFunction } from 'lodash';

let request;

const reasonMap = {
	400: async (response) => {
		try {
			const { reason, error, message } = await response.json();
			return reason || error || message;
		}
		catch (err) {}
	},
	401: '请重新登录',
	403: '没有权限访问',
	404: '找不到对象',
};

export default function getRequest(config) {
	if (request) { return request; }
	const { baseURL, timeout } = config.api;
	return (request = new RequestExtra({
		timeout,
		url: baseURL,
		type: 'json',
		responseType: 'json',
		simple: true,
		async errorTransformer(err) {
			if (!err || !err.response) { return err; }
			const { status } = err.response;
			const reason = reasonMap[status];

			if (!reason) { return err; }
			if (isFunction(reason)) {
				err.reason = await reason(err.response);
			}
			else {
				err.reason = reason;
			}
			return err;
		},
	}));
}
