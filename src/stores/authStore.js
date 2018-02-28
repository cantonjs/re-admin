import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import getRequest from 'utils/getRequest';
import { isString } from 'lodash';
import deprecated from 'utils/deprecated';
import showError from 'utils/showError';
import warning from 'warning';
import localeStore from 'stores/localeStore';

const locale = localeStore.requests;

const verifyAndSaveAccessToken = (authRes = {}) => {
	const { accessToken, expiresIn, expiresInMilliseconds } = authRes;

	if (!isString(accessToken)) {
		throw new Error(`"accessToken" is INVALID, received "${accessToken}"`);
	}

	const maxAge = expiresInMilliseconds || (expiresIn && expiresIn * 1000) || 0;

	__DEV__ && warning(+maxAge, 'Missing `expiresIn` attribute.');

	maxAge && cookie.set(ACCESS_TOKEN, accessToken, { maxAge });
};

class AuthStore {
	@observable isFetching = true;
	@observable accessToken = cookie.get(ACCESS_TOKEN);

	set(config) {
		this._apiConfig = config.api;
		this._config = config.auth;
		this._request = getRequest(config).clone(this._config.basePath);
	}

	// TODO: Deprecated
	getAccessToken() {
		deprecated('getAccessToken()', 'accessToken');
		return this.accessToken;
	}

	async auth() {
		this.isFetching = true;
		let isOk = false;
		try {
			const options = { url: this._config.getUserPath };
			if (this.accessToken) {
				const { accessTokenLocation } = this._apiConfig;
				options[accessTokenLocation] = {
					[this._apiConfig.accessTokenName]: this.accessToken,
				};
			}

			const res = await this._request.fetch(options);
			const authRes = this._config.mapOnGetUserResponse(res);
			verifyAndSaveAccessToken(authRes);
			this.accessToken = authRes.accessToken;
			isOk = true;
		} catch (err) {
			showError(locale.invalidToken, err);
		}
		this.isFetching = false;
		return isOk;
	}

	async login(body) {
		this.isFetching = true;
		let isOk = false;

		try {
			const res = await this._request.fetch({
				url: this._config.loginPath,
				method: 'POST',
				body,
			});

			const authRes = this._config.mapOnLoginResponse(res);
			verifyAndSaveAccessToken(authRes);
			this.accessToken = authRes.accessToken;

			isOk = true;
			message.success(locale.loginSuccess);
		} catch (err) {
			showError(locale.loginFailed, err);
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
