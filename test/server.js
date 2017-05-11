
const Koa = require('koa');
const Router = require('koa-router');
const kcors = require('kcors');
const koaBody = require('koa-body');

const app = new Koa();
const router = new Router();

const port = 3001;

const validAccessToken = 'paiBei4uChua8Aipooc9joeS';
// const expiresIn = 86400;
const expiresIn = 600;

let total = 450;
let testDB = new Array(total).fill().map((_, index) => ({
	id: `id_${index}`,
	name: `User ${index}`,
	score: 80,
	desc: `I am User no. ${index}`,
	avatar: `https://unsplash.it/100/100/?random=${index}`,
}));

const verify = async (ctx, next) => {
	const { accessToken } = ctx.query || {};
	if (!accessToken) { ctx.status = 401; }
	else if (accessToken !== validAccessToken) { ctx.status = 403; }
	else { await next(); }
};

router
	.get('/api/auth/getUser', verify, async (ctx) => {
		ctx.body = { accessToken: validAccessToken, expiresIn };
	})
	.post('/api/auth/login', async (ctx) => {
		const { username, password } = ctx.request.body;
		if (username === 'admin' && password === '123456') {
			ctx.body = { accessToken: validAccessToken, expiresIn };
		}
		else {
			ctx.status = 400;
			ctx.body = {
				error: 'Login failed',
			};
		}
	})
	.get('/api/test', verify, async (ctx) => {
		const { page, count } = ctx.request.query;
		const start = (page - 1) * +count;
		const list = testDB.slice(start, start + +count);
		ctx.body = { list, total };
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
;

app
	.use(kcors())
	.use(koaBody())
	.use(router.middleware())
	.listen(port, () => {
		console.log(`test server started at: http://localhost:${port}`);
	})
;
