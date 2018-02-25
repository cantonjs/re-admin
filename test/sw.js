import { router as toolboxRouter } from 'sw-toolbox';
import { parse } from 'tiny-querystring';

const router = {};
const createMethod = function createMethod(method) {
	router[method] = (path, handler) => {
		toolboxRouter[method](`${path}(.*)`, (request, params) => {
			const ctx = { request, params };
			const search = (request.url.match(/\?.*/) || ['?'])[0];
			request.query = parse(search.slice(1));
			return Promise.resolve(handler(ctx)).then(
				() => new Response(JSON.stringify(ctx.body))
			);
		});
		return router;
	};
};
['get', 'post', 'put', 'delete', 'patch'].forEach(createMethod);

let total = 240;
let testDB = new Array(total)
	.fill()
	.map((_, index) => ({
		id: `id_${index}`,
		name: `User ${index}`,
		fee: 200000,
		desc: `I am User no. ${index}`,
		tags: ['hello', 'world'],
		avatar: `https://unsplash.it/100/100/?random=${index}`,
		pet: {
			name: 'Bobby',
			type: 'dog',
			languages: [
				{ name: 'Javascript', score: 70 },
				{ name: 'HTML', score: 90 },
				{ name: 'CSS', score: 32 },
			],
		},
		check: Math.random() > 0.5,
		createdAt: new Date(
			Date.now() - (total - index) * 1000 * 60 * 60 * 24
		).toISOString(),
	}))
	.reverse();

router
	.get('/api/auth/getUser', (ctx) => {
		ctx.body = { accessToken: 'fack_access_token', expiresIn: 7200 };
	})
	.get('/api/test', (ctx) => {
		const { page, count, id } = ctx.request.query;
		const start = (page - 1) * +count;
		ctx.body = {
			list: id ? [testDB[0]] : testDB.slice(start, start + +count),
			total: id ? 1 : total,
		};
	})
	.get('/api/test', (ctx) => {
		const { page, count, id } = ctx.request.query;
		const start = (page - 1) * +count;
		ctx.body = {
			list: id ? [testDB[0]] : testDB.slice(start, start + +count),
			total: id ? 1 : total,
		};
	})
	.post('/api/test', (ctx) => {
		const { body } = ctx.request;
		body.id = `id_${total}`;
		total++;
		testDB.unshift(body);
		ctx.body = body;
	})
	.put('/api/test/:keys', (ctx) => {
		const { request: { body }, params: { keys } } = ctx;
		const keysArr = keys.split(',');
		for (const data of testDB) {
			if (keysArr.includes(data.id)) {
				Object.assign(data, body, { id: data.id });
			}
		}
		ctx.body = { ok: true };
	})
	.delete('/api/test/:keys', (ctx) => {
		const { keys } = ctx.params;
		const keysArr = keys.split(',');
		testDB = testDB.filter((data) => !keysArr.includes(data.id));
		ctx.body = { ok: true };
	})
	.get('/api/foo', (ctx) => {
		const { page, count, id } = ctx.request.query;
		const start = (page - 1) * +count;
		ctx.body = {
			list: id ? [testDB[0]] : testDB.slice(start, start + +count),
			total: id ? 1 : total,
		};
	})
	.post('/api/foo', (ctx) => {
		const { body } = ctx.request;
		body.id = `id_${total}`;
		total++;
		testDB.unshift(body);
		ctx.body = body;
	})
	.post('/api/test/:keys/foo', (ctx) => {
		const { request: { body }, params: { keys } } = ctx;
		ctx.body = { ...body, keys };
	})
	.post('/api2/test/:keys/foo/:fooKeys', (ctx) => {
		const { params: { keys, fooKeys } } = ctx;
		ctx.body = { keys, fooKeys };
	})
	.post('/api/upload/file', (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	})
	.post('/api/upload/image', (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	});
