
import Koa from 'koa';
import Router from 'koa-router';
import kcors from 'kcors';
import koaBody from 'koa-body';
import multer from 'multer';
import ms from 'ms';

const app = new Koa();
const router = new Router();

const port = process.env.BACKEND_SERVER_PORT || 3001;

const validAccessToken = 'paiBei4uChua8Aipooc9joeS';
// const expiresIn = 86400;
const expiresIn = 600;

let total = 450;
let testDB = new Array(total).fill().map((_, index) => ({
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
	createdAt: new Date(Date.now() - ms(`${total - index}d`)).toISOString(),
})).reverse();

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
		if (username === 'admin' && password === '000000') {
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
		const { page, count, id } = ctx.request.query;
		const start = (page - 1) * +count;
		ctx.body = {
			list: id ? [testDB[0]] : testDB.slice(start, start + +count),
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
	.post('/api/upload/file', async (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
	})
	.post('/api/upload/image', async (ctx) => {
		ctx.body = { url: `https://unsplash.it/100/100/?random=${Math.random()}` };
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
