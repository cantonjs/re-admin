export default async function fakeLogin({ username, password }) {
	return new Promise((resolve,) => {
		setTimeout(() => {
			if (username === 'admin' && password === '123456') {
				resolve({ accessToekn: 'paiBei4uChua8Aipooc9joeS' });
			}
			else {
				resolve({ error: 'username or password is wrong' });
			}
		}, 1000);
	});
}
