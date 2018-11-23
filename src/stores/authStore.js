import { observable } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import getRequest from 'utils/getRequest';
import { isString } from 'utils/fp';
import deprecated from 'utils/deprecated';
import showError from 'utils/showError';
import warning from 'warning';
import LocaleStores from 'stores/LocaleStores';

const locale = LocaleStores.ensure('requests');

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
		warning(this._config.basePath, 'Missing auth.basePath');
		this._request = getRequest(config).clone(this._config.basePath);
	}

	getAccessToken = deprecated(
		() => this.accessToken,
		'`getAccessToken()` is deprecated, please use `accessToken` instead'
	);

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
			this.accessToken = null;
			showError(locale.data.invalidToken, err);
		}
		this.isFetching = false;
		return isOk;
	}

	async login(body) {
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
			message.success(locale.data.loginSuccess);
		} catch (err) {
			this.accessToken = null;
			showError(locale.data.loginFailed, err);
		}
		return isOk;
	}

	logout() {
		this.accessToken = null;
		cookie.remove(ACCESS_TOKEN);
	}
}

export default new AuthStore();
