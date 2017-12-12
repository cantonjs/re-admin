
import { RequestExtra } from 'fetch-extra';

let request;

export default function getRequest(config) {
	if (request) { return request; }

	const {
		api: {
			baseURL, timeout,
		},
		errorMessages: {
			defaults = 'Request failed',
			statusMap = {},
			validResponse = (response) => response.ok,
			validResponseData,
			getMessage = (err) => err.reason,
		},
	} = config;

	return (request = new RequestExtra({
		timeout,
		url: baseURL,
		type: 'json',
		responseType: 'json',
		async responseTransformer(response) {
			const valid = await validResponse(response);
			if (!valid) {
				const error = new Error(response.statusText);
				error.response = response;
				throw error;
			}
			return response;
		},
		async responseDataTransformer(data) {
			if (validResponseData) {
				const valid = await validResponseData(data);
				if (!valid) {
					const error = new Error(defaults);
					Object.assign(error, data);
					throw error;
				}
			}
			return data;
		},
		async errorTransformer(err) {
			err.reason = (await getMessage(err, err.response));
			if (!err.reason && err.response && err.response.status) {
				const reason = statusMap[err.response.status];
				err.reason = reason || err.message;
			}
			if (!err.reason) {
				err.reason = defaults;
			}
			return err;
		},
	}));
}
