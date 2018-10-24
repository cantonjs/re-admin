import {
	computed,
	observable,
	action,
	runInAction,
	observe,
	extendObservable,
} from 'mobx';
import { isFunction, reduce, assign } from 'lodash';
import showError from 'utils/showError';
import LocaleStores from 'stores/LocaleStores';
import warning from 'warning';
import Table from 'schemas/Table';

const locale = LocaleStores.ensure('requests');

export default class BaseDataStore {
	@observable query = {};
	@observable selectedKeys = [];

	@computed
	get cacheKey() {
		return JSON.stringify(this.query);
	}

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

	get renderers() {
		return this.config.renderers;
	}

	constructor(options = {}) {
		const {
			name,
			appConfig,
			authStore,
			config: customConfig,
			baseRequest,
			router,
		} = options;
		this.name = name;
		this._customConfig = customConfig;
		this.appConfig = appConfig;
		this.extends = {};
		this.router = router;

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

	mount() {
		const { router } = this;
		if (router) {
			const { location } = router;
			this._queryDisposer = observe(location, 'query', ({ newValue }) => {
				runInAction(() => (this.query = newValue));
			});
		}
	}

	@action
	setQuery(query) {
		if (this.router) this.router.location.query = query;
		else this.query = query;
	}

	observeQuery(handler) {
		return observe(this, 'query', handler);
	}

	extend(extensions) {
		const extendProps = {};
		this.extends = reduce(
			extensions,
			(ext, val, key) => {
				if (isFunction(val)) ext[key] = val.bind(this);
				else extendProps[key] = val;
				return ext;
			},
			this.extends
		);
		extendObservable(this, extendProps);
		return this;
	}

	call(method, ...args) {
		if (isFunction(this.extends[method])) {
			return this.extends[method].apply(this, args);
		} else if (isFunction(this[method])) {
			return this[method].apply(this, args);
		} else {
			throw new Error(
				`Method "${method}" is not found in table store "${this.name}"`
			);
		}
	}

	async fetch(options = {}) {
		return this.request({
			errorTitle: locale.data.fetchFailed,
			...options,
			refresh: false,
		});
	}

	async create(options = {}) {
		return this.request({
			method: 'POST',
			body: this.config.mapOnSave(options.body, 'create'),
			errorTitle: locale.data.createFailed,
			refresh: true,
			...options,
		});
	}

	async update(options = {}) {
		return this.request({
			method: 'PUT',
			body: this.config.mapOnSave(options.body, 'update'),
			errorTitle: locale.data.updateFailed,
			refresh: true,
			...options,
		});
	}

	async remove(options = {}) {
		return this.request({
			method: 'DELETE',
			errorTitle: locale.data.removeFailed,
			refresh: true,
			...options,
		});
	}

	async request(options = {}) {
		const {
			errorTitle = locale.data.failed,
			refresh = false,
			throwError = false,

			/* ignore starts */
			footer,
			header,
			toolbar,
			title,
			/* ignore ends */

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
			} else {
				console.error(errorTitle, err);
				showError(errorTitle, err);
			}
		}
	}

	unmount() {
		this._queryDisposer && this._queryDisposer();
	}
}
