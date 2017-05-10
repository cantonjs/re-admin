
import Ask from 'http-ask';
import getAppConfig from 'utils/getAppConfig';

const { baseURL, timeout } = getAppConfig().api;

export const base = Ask.create({
	url: baseURL,
	timeout,
	parser(data) {
		let error;
		const { errors, errcode, code, errmsg } = data;
		if (errors) {
			error = errors.length ? errors[0] : errors;
		}
		else if (+errcode || +code || errmsg) {
			error = data;
		}

		if (error) {
			throw error;
		}
		else if (data.error) {
			throw data.error;
		}

		return data;
	},
});
