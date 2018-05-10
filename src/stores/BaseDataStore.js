import { computed } from 'mobx';
import { isFunction, reduce, assign } from 'lodash';
import showError from 'utils/showError';
import LocaleStores from 'stores/LocaleStores';
import warning from 'warning';
import Table from 'schemas/Table';

const locale = LocaleStores.ensure('requests');

export default class BaseDataStore {
	@computed
	get config() {
		const name = this.name;
		const table = this.appConfig.tables[name];
		warning(!name || table, `Table "${name}" is NOT found`);
		return {
			...Table.defaultProps,
			...table,
			...this._customConfig,
		};
	}

	constructor(options = {}) {
		const {
			name,
			appConfig,
			authStore,
			config: customConfig,
			baseRequest,
		} = options;
		this.name = name;
		this._customConfig = customConfig;
		this.appConfig = appConfig;
		this.extends = {};

		const { extend, api } = this.config;
		const { accessTokenLocation, accessTokenName } = appConfig.api;
		const fetchAuthTransformerName =
			accessTokenLocation === 'query' ?
				'addQueryTransformer' :
				'addHeadersTransformer';
		baseRequest[fetchAuthTransformerName]((queryOrHeaders) => {
			const { accessToken } = authStore;
			if (accessToken) {
				queryOrHeaders[accessTokenName] = accessToken;
			}
			return queryOrHeaders;
		});

		if (api) {
			const { pathname, query, headers } = api;
			this.pathname = pathname;
			this.extend(extend);
			this.baseRequest = baseRequest.clone({
				url: pathname,
				headers,
				queryTransformer: (reqQuery) => assign({}, query, reqQuery),
			});
		} else {
			this.baseRequest = baseRequest;
		}
		this.performRequest = this.baseRequest.fetch.bind(this.baseRequest);
	}

	extend(extensions) {
		this.extends = reduce(
			extensions,
			(ext, fn, key) => {
				ext[key] = fn.bind(this);
				return ext;
			},
			this.extends
		);
		return this;
	}

	call(method, ...args) {
		if (isFunction(this.extends[method])) {
			return this.extends[method].apply(this, args);
		} else if (isFunction(this[method])) {
			return this[method].apply(this, args);
		} else {
			throw new Error(
				`Method "${method}" not found in table store "${this.name}"`
			);
		}
	}

	async fetch(options = {}) {
		await this.request({
			requestFn: 'fetch',
			errorTitle: locale.data.fetchFailed,
			...options,
			refresh: false,
		});
	}

	async create(options = {}) {
		await this.request({
			method: 'POST',
			body: this.config.mapOnSave(options.body, 'create'),
			errorTitle: locale.data.createFailed,
			...options,
			refresh: true,
		});
	}

	async update(options = {}) {
		await this.request({
			method: 'PUT',
			body: this.config.mapOnSave(options.body, 'update'),
			errorTitle: locale.data.updateFailed,
			...options,
			refresh: true,
		});
	}

	async remove(options = {}) {
		await this.request({
			method: 'DELETE',
			errorTitle: locale.data.removeFailed,
			...options,
			refresh: true,
		});
	}

	async request(options = {}) {
		const {
			errorTitle = locale.data.failed,
			refresh = false,
			throwError = false,
			...requestOptions
		} = options;
		try {
			const res = await this.performRequest(requestOptions);
			if (refresh && refresh !== 'no' && isFunction(this.refresh)) {
				this.refresh();
			}
			return res;
		} catch (err) {
			if (throwError) {
				throw err;
			}
			console.error(errorTitle, err);
			showError(errorTitle, err);
		}
	}
}
