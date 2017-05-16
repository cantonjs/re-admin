
import Ask from 'http-ask';

let cache;

export default function getAsk(config) {
	if (cache) { return cache; }

	const { baseURL, timeout } = config.api;
	const ask = Ask.create({
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
	return (cache = ask);
}
