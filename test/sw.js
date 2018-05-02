import router from './swRouter';

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

const validAccessToken = 'FAKE_ACCESS_TOKEN_FOR_DEMO_ONLY';
const expiresIn = 7200;

const verify = async (ctx, next) => {
	const { accessToken } = ctx.request.query || {};
	if (!accessToken) {
		ctx.status = 401;
	} else if (accessToken !== validAccessToken) {
		ctx.status = 403;
	} else {
		await next();
	}
};

router
	.get('/api/auth/getUser', verify, async (ctx) => {
		ctx.body = { accessToken: validAccessToken, expiresIn };
	})
	.post('/api/auth/login', async (ctx) => {
		const { username, password } = ctx.request.body;
		if (username === 'admin' && password === '000000') {
			ctx.body = { accessToken: validAccessToken, expiresIn };
		} else {
			ctx.status = 400;
			ctx.body = {
				reason: 'Invalid username or password',
			};
		}
	})
	.get('/api/test', verify, async (ctx) => {
		const { page, count, id } = ctx.request.query;
		const start = (page - 1) * +count;
		ctx.body = {
			list: id ? [testDB[0]] : testDB.slice(start, start + +count),
			total: id ? 1 : total,
		};
	})
	.get('/api/test', verify, verify, async (ctx) => {
		const { page, count, id, check } = ctx.request.query;
		const start = (page - 1) * +count;
		const db =
			check === undefined ?
				testDB :
				testDB.filter((item) => item.check === (check && check !== 'false'));
		ctx.body = {
			list: id ? [db[0]] : db.slice(start, start + +count),
			total: id ? 1 : total,
		};
	})
	.post('/api/test', verify, async (ctx) => {
		const { body } = ctx.request;
		body.id = `id_${total}`;
		total++;
		testDB.unshift(body);
		ctx.body = body;
	})
	.put('/api/test/:keys', verify, async (ctx) => {
		const { request: { body }, params: { keys } } = ctx;
		const keysArr = keys.split(',');
		for (const data of testDB) {
			if (keysArr.includes(data.id)) {
				Object.assign(data, body, { id: data.id });
			}
		}
		ctx.body = { ok: true };
	})
	.delete('/api/test/:keys', verify, async (ctx) => {
		const { keys } = ctx.params;
		const keysArr = keys.split(',');
		testDB = testDB.filter((data) => !keysArr.includes(data.id));
		ctx.body = { ok: true };
	})
	.get('/api/bar', verify, async (ctx) => {
		const { page, count, id } = ctx.request.query;
		const start = (page - 1) * +count;
		ctx.body = {
			list: id ? [testDB[0]] : testDB.slice(start, start + +count),
			total: id ? 1 : total,
		};
	})
	.post('/api/bar', verify, async (ctx) => {
		const { body } = ctx.request;
		body.id = `id_${total}`;
		total++;
		testDB.unshift(body);
		ctx.body = body;
	})
	.post('/api/test/:keys/bar', verify, async (ctx) => {
		const { request: { body }, params: { keys } } = ctx;
		ctx.body = { ...body, keys };
	})
	.post('/api2/test/:keys/bar/:barKeys', verify, async (ctx) => {
		const { params: { keys, barKeys } } = ctx;
		ctx.body = { keys, barKeys };
	})
	.post('/api/upload/file', async (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	})
	.post('/api/upload/image', async (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	});
