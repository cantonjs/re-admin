
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import getAsk from 'utils/getAsk';
import { isString } from 'lodash';

const verifyAndSaveAccessToken = (token, maxAge = 60) => {
	if (!isString(token)) {
		throw new Error(`"accessToken" is INVALID, received "${token}"`);
	}
	cookie.set(ACCESS_TOKEN, token, { maxAge });
};

export default class AuthStore {
	@observable isFetching = false;

	constructor(config) {
		this._config = config.auth;
		this._ask = getAsk(config).clone(this._config.basePath);
	}

	getAccessToken() {
		return cookie.get(ACCESS_TOKEN);
	}

	async auth() {
		this.isFetching = true;
		let isOk = false;
		try {
			const query = {};
			const token = this.getAccessToken();
			if (token) { query.accessToken = token; }

			const { accessToken, expiresIn } = await this._ask.fork({
				url: this._config.getUserPath,
				query,
			});

			verifyAndSaveAccessToken(accessToken, expiresIn);

			this.accessToken = accessToken;
			isOk = true;

			__DEV__ && console.log('Auth success');
		}
		catch (err) {
			__DEV__ && console.error(err);
			message.error('登录凭证已失效，请重新登录');
		}
		this.isFetching = false;
		return isOk;
	}

	async login(body) {
		this.isFetching = true;
		let isOk = false;

		try {
			const { accessToken, expiresIn } = await this._ask.fork({
				url: this._config.loginPath,
				method: 'POST',
				body,
			});

			verifyAndSaveAccessToken(accessToken, expiresIn);

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
