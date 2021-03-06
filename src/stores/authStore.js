import { observable, action, runInAction } from 'mobx';
import cookie from 'utils/cookie';
import { ACCESS_TOKEN } from 'constants/CookieKeys';
import { message } from 'antd';
import getRequest from 'utils/getRequest';
import { isString, isFunction } from 'utils/fp';
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
	@observable username = 'Admin';

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

	@action
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
			const { username } = authRes;
			runInAction(() => {
				this.isFetching = false;
				this.accessToken = authRes.accessToken;
				if (username) {
					this.username = username;
				}
			});
			isOk = true;
		} catch (err) {
			runInAction(() => {
				this.isFetching = false;
				this.accessToken = null;
			});
			showError(locale.data.invalidToken, err);
		}
		return isOk;
	}

	@action
	async login(body) {
		let isOk = false;

		const { crypto } = this._config;
		if (body && body.password && isFunction(crypto)) {
			body.password = crypto(body.password);
		}

		try {
			const res = await this._request.fetch({
				url: this._config.loginPath,
				method: 'POST',
				body,
				bodyTransformer: this._config.mapOnLoginRequestBody,
			});

			const authRes = this._config.mapOnLoginResponse(res);
			verifyAndSaveAccessToken(authRes);

			runInAction(() => {
				this.accessToken = authRes.accessToken;
			});

			isOk = true;
			message.success(locale.data.loginSuccessful);
		} catch (err) {
			runInAction(() => {
				this.accessToken = null;
			});
			console.error(err);
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
