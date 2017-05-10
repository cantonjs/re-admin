
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';

// TODO
import fakeLogin from 'utils/fakeLogin';

class AuthStore {
	@observable accessToken = '';
	@observable isFetching = false;

	async auth(accessToken) {
		console.log('accessToken', accessToken);
	}

	async login(body) {
		this.isFetching = true;
		let isOk = false;
		try {
			const { accessToken, expiresIn } = await fakeLogin(body);
			cookie.set(ACCESS_TOKEN, accessToken, { maxAge: expiresIn });
			this.accessToken = accessToken;
			isOk = true;
		}
		catch (err) {

			// TODO: should handle error
			console.error('login faild:', err);
		}
		this.isFetching = false;
		return isOk;
	}

	logout() {
		this.accessToken = '';
		cookie.remove(ACCESS_TOKEN);
	}
}

export default new AuthStore();
