import { router as toolboxRouter } from 'sw-toolbox';
import { parse } from 'tiny-querystring';

const router = {};
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

			if (!~['GET', 'HEAD'].indexOf(request.method)) {
				request.body = await request.json();
			}

			for (const middleware of middlewares) {
				let shouldBreak = true;
				const next = () => (shouldBreak = false);
				await middleware(ctx, next);
				if (shouldBreak) {
					break;
				}
			}

			let { status, statusText, body } = ctx;
			if (!body) {
				if (status === 400) {
					body = 'CLIENT ERROR';
				} else if (status === 401) {
					body = 'Unauthorized';
				} else if (status === 403) {
					body = 'Forbidden';
				} else if (status === 404) {
					body = 'NOT FOUND';
				}
				if (!statusText) {
					statusText = body;
				}
			} else {
				body = JSON.stringify(body);
			}

			if (!statusText) {
				statusText = 'ok';
			}

			return new Response(body, { status, statusText });
		});
		return router;
	};
};
['get', 'post', 'put', 'delete', 'patch'].forEach(createMethod);

export default router;
