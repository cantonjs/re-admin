import { router as toolboxRouter } from 'sw-toolbox';
import { parse } from 'tiny-querystring';
import statuses from 'statuses';

const router = {};

const compose = async function compose(ctx, middlewares) {
	const middleware = middlewares.shift();
	if (middleware) {
		const next = async () => {
			await compose(ctx, middlewares);
		};
		await middleware(ctx, next);
	}
};

const delay = function delay() {
	return new Promise((resolve) => {
		setTimeout(resolve, Math.random() * 1000);
	});
};

const createMethod = function createMethod(method) {
	router[method] = (path, ...middlewares) => {
		toolboxRouter[method](`${path}(.*)`, async (request, params) => {
			const ctx = {
				request,
				params,
				status: 200,
				body: null,
			};
			const search = (request.url.match(/\?.*/) || ['?'])[0];
			request.query = parse(search.slice(1));

			const contentType = request.headers.get('content-type');
			const isJson = contentType === 'application/json';

			if (!~['GET', 'HEAD'].indexOf(request.method) && isJson) {
				request.body = await request.json();
			}

			await compose(ctx, middlewares.slice());

			let { status, statusText, body } = ctx;

			if (!body) {
				body = statuses[status];
			} else if (isJson) {
				body = JSON.stringify(body);
			}

			if (!statusText) {
				statusText = statuses[status];
			}

			await delay();

			return new Response(body, { status, statusText });
		});
		return router;
	};
};
['get', 'post', 'put', 'delete', 'patch'].forEach(createMethod);

export default router;
