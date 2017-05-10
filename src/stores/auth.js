
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import { base } from 'utils/asks';
import getAppConfig from 'utils/getAppConfig.js';

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

			const { accessToken, expiresIn } = await ask.fork({
				url: getUserPath,
				query: {
					accessToken: this.getAccessToken(),
				},
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
			const { accessToken, expiresIn } = await ask.fork({
				url: loginPath,
				method: 'POST',
				body,
			});
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
