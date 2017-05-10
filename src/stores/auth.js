
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import { base } from 'utils/asks';
import getAppConfig from 'utils/getAppConfig.js';

// TODO
import fakeLogin from 'utils/fakeLogin';
import fakeAuth from 'utils/fakeAuth';

const { basePath, loginPath, getUserPath } = getAppConfig().auth;
const ask = base.clone(basePath);

class AuthStore {
	@observable isFetching = false;

	getAccessToken() {
		return cookie.get(ACCESS_TOKEN);
	}

	async auth() {
		this.isFetching = true;
		let isOk = false;
		try {

			// TODO
			__DEV__ && console.log(ask.clone({
				url: getUserPath,
				query: {
					accessToken: this.getAccessToken(),
				},
			}));
			const { accessToken, expiresIn } = await fakeAuth({
				accessToken: this.getAccessToken(),
			});

			cookie.set(ACCESS_TOKEN, accessToken, { maxAge: expiresIn });
			this.accessToken = accessToken;
			isOk = true;

			__DEV__ && console.log('Auth success');
		}
		catch (err) {
			message.error('登录凭证已失效，请重新登录');
		}
		this.isFetching = false;
		return isOk;
	}

	async login(body) {
		this.isFetching = true;
		let isOk = false;
		try {

			// TODO
			const { accessToken, expiresIn } = await fakeLogin(body);

			__DEV__ && console.log(ask.clone({
				url: loginPath,
				method: 'POST',
				body,
			}));

			cookie.set(ACCESS_TOKEN, accessToken, { maxAge: expiresIn });
			isOk = true;
			message.success('登录成功');
		}
		catch (err) {
			message.error(`登录失败：${err.message}`);
		}
		this.isFetching = false;
		return isOk;
	}

	logout() {
		cookie.remove(ACCESS_TOKEN);
	}
}

export default new AuthStore();
