
import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import getRequest from 'utils/getRequest';
import { isString } from 'lodash';
import deprecated from 'utils/deprecated';

const deprecatedGetAccessToken = deprecated({
	outdated: 'getAccessToken()',
	replacement: 'accessToken',
});

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

class AuthStore {
	@observable isFetching = true;
	@observable accessToken = cookie.get(ACCESS_TOKEN);

	init(config) {
		this._apiConfig = config.api;
		this._config = config.auth;
		this._request = getRequest(config).clone(this._config.basePath);
	}

	// TODO: Deprecated
	getAccessToken() {
		deprecatedGetAccessToken();
		return this.accessToken;
	}

	async auth() {
		this.isFetching = true;
		let isOk = false;
		try {
			const { accessToken, expiresIn } = await this._request.fetch({
				url: this._config.getUserPath,
				[this._apiConfig.accessTokenLocation]: {
					[this._apiConfig.accessTokenName]: this.accessToken,
				},
			});

			verifyAndSaveAccessToken(accessToken, expiresIn);

			this.accessToken = accessToken;
			isOk = true;
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
			const { accessToken, expiresIn } = await this._request.fetch({
				url: this._config.loginPath,
				method: 'POST',
				body,
			});

			verifyAndSaveAccessToken(accessToken, expiresIn);
			this.accessToken = accessToken;

			isOk = true;
			message.success('登录成功');
		}
		catch (err) {
			message.error(`登录失败：${err.reason || err.message}`);
		}
		this.isFetching = false;
		return isOk;
	}

	logout() {
		this.accessToken = null;
		cookie.remove(ACCESS_TOKEN);
	}
}

export default new AuthStore();
