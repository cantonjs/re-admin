import { router as toolboxRouter } from 'sw-toolbox';
import { parse } from 'tiny-querystring';

const router = {};
const createMethod = function createMethod(method) {
	router[method] = (path, handler) => {
		toolboxRouter[method](`${path}(.*)`, (request, params) => {
			const search = (request.url.match(/\?.*/) || ['?'])[0];
			request.query = parse(search.slice(1));
			return Promise.resolve(handler(request, params)).then(
				(res) => new Response(JSON.stringify(res))
			);
		});
	};
};
['get', 'post', 'put', 'delete', 'patch'].forEach(createMethod);

let total = 240;
let fakeDb = new Array(total)
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

router.get('/api/auth/getUser', () => {
	return { accessToken: 'fack_access_token', expiresIn: 7200 };
});

router.get('/api/test', (req) => {
	const { page, count, id } = req.query;
	const start = (page - 1) * +count;
	return {
		list: id ? [fakeDb[0]] : fakeDb.slice(start, start + +count),
		total: id ? 1 : total,
	};
});
