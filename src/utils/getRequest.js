
import { RequestExtra } from 'fetch-extra';

let request;

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
			const { response } = err;

			let errorBody = {};
			switch (response.status) {
				case 400:
					errorBody = await response.json();
					break;
				case 404:
					errorBody = { reason: '找不到数据' };
					break;
				default:
					errorBody = { reason: '出现未知错误' };
			}
			Object.assign(err, errorBody);
			return err;
		},
	}));
}
