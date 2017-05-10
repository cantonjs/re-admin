
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';

// TODO
import fakeLogin from 'utils/fakeLogin';
import fakeAuth from 'utils/fakeAuth';

class AuthStore {
	@observable isFetching = false;

	getAccessToken() {
		return cookie.get(ACCESS_TOKEN);
	}

	async auth() {
		this.isFetching = true;
		let isOk = false;
		try {
			const { accessToken, expiresIn } = await fakeAuth({
				accessToken: this.getAccessToken(),
			});
			cookie.set(ACCESS_TOKEN, accessToken, { maxAge: expiresIn });
			this.accessToken = accessToken;
			isOk = true;

			__DEV__ && console.log('Auth success');
		}
		catch (err) {

			// TODO: should handle error
			console.error('Auth failed:', err);
		}
		this.isFetching = false;
		return isOk;
	}

	async login(body) {
		this.isFetching = true;
		let isOk = false;
		try {
			const { accessToken, expiresIn } = await fakeLogin(body);
			cookie.set(ACCESS_TOKEN, accessToken, { maxAge: expiresIn });
			isOk = true;
		}
		catch (err) {

			// TODO: should handle error
			console.error('Login failed:', err);
		}
		this.isFetching = false;
		return isOk;
	}

	logout() {
		cookie.remove(ACCESS_TOKEN);
	}
}

export default new AuthStore();
