
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import getAsk from 'utils/getAsk';
import { isString } from 'lodash';

const verifyAndSaveAccessToken = (token, maxAge) => {
	if (!isString(token)) {
		throw new Error(`"accessToken" is INVALID, received "${token}"`);
	}

	if (!+maxAge) {
		__DEV__ && console.warn(
			'Missing `expiresIn` attribute.'
		);
	}

	maxAge && cookie.set(ACCESS_TOKEN, token, { maxAge });
};

export default class AuthStore {
	@observable isFetching = false;

	constructor(config) {
		this._apiConfig = config.api;
		this._config = config.auth;
		this._ask = getAsk(config).clone(this._config.basePath);
	}

	getAccessToken() {
		return this.accessToken || cookie.get(ACCESS_TOKEN);
	}

	async auth() {
		this.isFetching = true;
		let isOk = false;
		try {
			const token = this.getAccessToken();

			const { accessToken, expiresIn } = await this._ask.fork({
				url: this._config.getUserPath,
				[this._apiConfig.accessTokenLocation]: {
					[this._apiConfig.accessTokenName]({ remove }) {
						if (!token) { remove(); }
						else { return token; }
					},
				},
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
