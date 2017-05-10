
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import messageStore from 'stores/message';

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
			messageStore.push('登录凭证已失效，请重新登录', 'error');
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
			messageStore.push('登录成功', 'success');
		}
		catch (err) {
			messageStore.push(`登录失败：${err.message}`, 'error');
		}
		this.isFetching = false;
		return isOk;
	}

	logout() {
		cookie.remove(ACCESS_TOKEN);
	}
}

export default new AuthStore();
