import { observable, computed } from 'mobx';
import { isFunction, isObject, reduce, assign } from 'lodash';
import showError from 'utils/showError';
import localeStore from 'stores/localeStore';
import warning from 'warning';
import getRequest from 'utils/getRequest';
import DataListStore from './DataListStore';
import DataDetailStore from './DataDetailStore';

const caches = observable.map();
const locale = localeStore.requests;
let appConfig = {};
let authStore = {};

const defaultStoreName = '_default';

export default class DataStore {
	static get(tableName, customConfig) {
		if (caches.has(tableName)) {
			return caches.get(tableName);
		}
		const store = new DataStore(tableName, customConfig);
		caches.set(tableName, store);
		return store;
	}

	static setup(config, auth) {
		appConfig = config;
		authStore = auth;
	}

	@computed
	get tableConfig() {
		const tableName = this.tableName;
		const table = appConfig.tables[tableName];
		warning(!tableName || table, `Table "${tableName}" is NOT found`);
		return {
			...table,
			...this._customConfig,
		};
	}

	constructor(tableName, customConfig = {}) {
		this.tableName = tableName;
		this._customConfig = customConfig;
		this.appConfig = appConfig;
		this.extends = {};

		const { extend, api } = this.tableConfig;
		const baseRequest = getRequest(appConfig);
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

		this.stores = {
			list: { [defaultStoreName]: new DataListStore(this, defaultStoreName) },
			detail: {
				[defaultStoreName]: new DataDetailStore(this, defaultStoreName),
			},
		};
	}

	getStore(type = 'list', name = defaultStoreName) {
		if (!~['list', 'detail'].indexOf(type)) {
			throw new Error(
				`Only type "list" or "detail" is valid, but received "${type}"`
			);
		}
		return this.stores[type][name];
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
				`Method "${method}" not found in table store "${this.tableName}"`
			);
		}
	}

	async fetch(options = {}) {
		await this.request({
			requestFn: 'fetch',
			errorTitle: locale.fetchFailed,
			...options,
			refresh: false,
		});
	}

	async create(options = {}) {
		await this.request({
			method: 'POST',
			body: this.tableConfig.mapOnSave(options.body, 'create'),
			errorTitle: locale.createFailed,
			...options,
			refresh: true,
		});
	}

	async update(options = {}) {
		await this.request({
			method: 'PUT',
			body: this.tableConfig.mapOnSave(options.body, 'update'),
			errorTitle: locale.updateFailed,
			...options,
			refresh: true,
		});
	}

	async remove(options = {}) {
		await this.request({
			method: 'DELETE',
			errorTitle: locale.removeFailed,
			...options,
			refresh: true,
		});
	}

	async request(options = {}) {
		const { ref, storeType } = options;
		const {
			errorTitle = locale.failed,
			refresh = false,
			throwError = false,
			requestFn = 'request',
			...requestOptions
		} = options;
		try {
			const store = isObject(ref) ? ref : this.getStore(storeType, ref);
			const res = await store[requestFn](requestOptions);
			if (refresh && refresh !== 'no' && isFunction(store.refresh)) {
				store.refresh();
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
