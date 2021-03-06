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
		num: Math.floor(101 * Math.random(0)),
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

const username = 'admin';

router
	.get('/api/auth/getUser', verify, async (ctx) => {
		ctx.body = { accessToken: validAccessToken, expiresIn, username };
	})
	.post('/api/auth/login', async (ctx) => {
		const { username: user, password } = ctx.request.body;
		if (user === username && password === '000000') {
			ctx.body = { accessToken: validAccessToken, expiresIn };
		} else {
			ctx.status = 400;
			ctx.body = {
				reason: 'Invalid username or password',
			};
		}
	})
	.get('/api/test/:key', verify, async (ctx) => {
		const { key } = ctx.params;
		const data = testDB.find(({ id }) => id === key);
		if (data) ctx.body = data;
		else ctx.status = 404;
	})
	.put('/api/test/:key', verify, async (ctx) => {
		const { body } = ctx.request;
		const { key } = ctx.params;
		const data = testDB.find(({ id }) => id === key);
		if (data) ctx.body = Object.assign(data, body);
		else ctx.status = 404;
	})
	.get('/api/test', verify, async (ctx) => {
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
	.delete('/api/test/:keys', verify, async (ctx) => {
		const { keys } = ctx.params;
		const keysArr = keys.split(',');
		testDB = testDB.filter((data) => !keysArr.includes(data.id));
		ctx.body = { ok: true };
	})
	.get('/api/article/:key', verify, async (ctx) => {
		const { key } = ctx.params;
		const data = testDB.find(({ id }) => id === key);
		if (data) ctx.body = data;
		else ctx.status = 404;
	})
	.get('/api/article', verify, async (ctx) => {
		const { cursor, count } = ctx.request.query;
		const size = +count;
		const index = cursor ? testDB.findIndex((item) => item.id === cursor) : 0;
		if (index < 0) {
			ctx.body = { list: [], nextCursor: null };
		} else {
			const nextCursorIndex = index + size;
			const nextCursor =
				nextCursorIndex >= testDB.length ? null : testDB[nextCursorIndex].id;
			ctx.body = {
				list: testDB.slice(index, index + size),
				nextCursor,
			};
		}
	})
	.post('/api/article', verify, async (ctx) => {
		const { body } = ctx.request;
		body.id = `id_${total}`;
		total++;
		testDB.unshift(body);
		ctx.body = body;
	})
	.put('/api/article/:keys', verify, async (ctx) => {
		const {
			request: { body },
			params: { keys },
		} = ctx;
		const keysArr = keys.split(',');
		for (const data of testDB) {
			if (keysArr.includes(data.id)) {
				Object.assign(data, body, { id: data.id });
			}
		}
		ctx.body = { ok: true };
	})
	.delete('/api/article/:keys', verify, async (ctx) => {
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
		const {
			request: { body },
			params: { keys },
		} = ctx;
		ctx.body = { ...body, keys };
	})
	.post('/api2/test/:keys/bar/:barKeys', verify, async (ctx) => {
		const {
			params: { keys, barKeys },
		} = ctx;
		ctx.body = { keys, barKeys };
	})
	.post('/api/upload/file', async (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	})
	.post('/api/upload/image', async (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	});
