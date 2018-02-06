import { observable, computed, toJS } from 'mobx';
import { omitBy, assign, isFunction, isUndefined, reduce } from 'lodash';
import getRequest from 'utils/getRequest';
import showError from 'utils/showError';
import deprecated from 'utils/deprecated';
import routerStore from 'stores/routerStore';
import ActionModalStore from 'stores/ActionModalStore';

const caches = observable.map();
let appConfig = {};
let authStore = {};

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

	@observable _prevFetchKey = '?';
	@observable isFetching = false;
	@observable selectedKeys = [];
	@observable data = {};

	@computed
	get tableConfig() {
		const tableName = this._tableName;
		const table = appConfig.tables[tableName];
		if (tableName && !table) {
			console.warn(`Table "${tableName}" is NOT found`);
		}
		return {
			...table,
			...this._customConfig,
		};
	}

	@computed
	get collection() {
		return this.collections.get(this._prevFetchKey);
	}

	@computed
	get total() {
		return this.totals.get(this._prevFetchKey) || 0;
	}

	@computed
	get dataSource() {
		return toJS(this.collection);
	}

	@computed
	get sortedKey() {
		return routerStore.location.query[appConfig.api.sortKey];
	}

	@computed
	get sortedOrder() {
		const { orderKey, ascValue } = appConfig.api;
		const { query } = routerStore.location;
		let order = query[orderKey];

		if (!this.sortedKey) {
			return order;
		}

		/* eslint-disable eqeqeq */
		return order == ascValue ? 'ascend' : 'descend';
	}

	@computed
	get columns() {
		if (!this.tableConfig.tableRenderers) {
			return [];
		}

		return this.tableConfig.tableRenderers.map(({ render, props, options }) => {
			const column = {
				title: props.label,
				key: props.name,
				dataIndex: props.name,
				render: function renderTable(text, record, index) {
					return render(props, {
						...options,
						text,
						value: text,
						record,
						index,
					});
				},
			};

			if (props.sortable) {
				const { sortedKey, sortedOrder } = this;
				column.sortOrder = props.name === sortedKey ? sortedOrder : false;
				column.sorter = true;
			}

			return column;
		});
	}

	@computed
	get maxSelections() {
		return this.tableConfig.maxSelections;
	}

	@computed
	get queryRenderers() {
		return this.tableConfig.queryRenderers;
	}

	@computed
	get formRenderers() {
		return this.tableConfig.formRenderers;
	}

	collections = observable.map();
	totals = observable.map();

	constructor(tableName, customConfig = {}) {
		this._tableName = tableName;
		this._customConfig = customConfig;

		const { tableRenderers, queryRenderers, extend, api } = this.tableConfig;

		this._request = getRequest(appConfig);
		this.size = +appConfig.api.count;

		if (api) {
			const sortableField =
				tableRenderers && tableRenderers.find(({ props }) => props.sortable);

			const { pathname, query, headers } = api;

			this.uniqueKey = this.tableConfig.uniqueKey;
			this.hasSortableField = !!sortableField;
			this.hasQueryField = !!queryRenderers.length;
			this.pathname = pathname;
			if (query.count) {
				this.size = +query.count;
			}
			this.extend(extend);

			this._request = this._request.clone({
				url: pathname,
				headers,
				queryTransformer: (reqQuery) => assign({}, query, reqQuery),
			});
		}

		const { accessTokenLocation, accessTokenName } = appConfig.api;
		const fetchAuthTransformerName =
			accessTokenLocation === 'query' ?
				'addQueryTransformer' :
				'addHeadersTransformer';

		this._request[fetchAuthTransformerName]((queryOrHeaders) => {
			const { accessToken } = authStore;
			if (accessToken) {
				queryOrHeaders[accessTokenName] = accessToken;
			}
			return queryOrHeaders;
		});
	}

	extend(extensions) {
		this.extends = reduce(
			extensions,
			(ext, fn, key) => {
				ext[key] = fn.bind(this);
				return ext;
			},
			this.extends || {}
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
				`Method "${method}" not found in table store "${this._tableName}"`
			);
		}
	}

	async fetch(options = {}) {
		const { query = {}, state = {}, ...other } = options;
		const { cacheKey } = state;

		if (cacheKey && this.collections.has(cacheKey)) {
			this._prevFetchKey = cacheKey;
			return this;
		}

		this.isFetching = true;

		try {
			const res = await this._request.fetch({
				...other,
				query: {
					count: this.size,
					...omitBy(query, ActionModalStore.getOmitPaths),
					page: (function () {
						const p = query.page || 1;
						return p < 1 ? 1 : p;
					})(),
				},
			});
			const { total, list = [] } = await this.tableConfig.mapOnFetchResponse(
				res
			);

			const collection = list.map((data, index) => {
				data.key = this.uniqueKey ? data[this.uniqueKey] : index;
				return data;
			});

			this._prevFetchKey = cacheKey || '@@last';
			this.collections.set(this._prevFetchKey, collection);
			this.totals.set(this._prevFetchKey, total);
		} catch (err) {
			showError('请求失败', err);
		}

		this.isFetching = false;
		return this;
	}

	async fetchOne(query) {
		try {
			const res = await this._request.fetch({ query });
			this.data = await this.tableConfig.mapOnFetchOneResponse(res);
		} catch (err) {
			showError('请求失败', err);
		}
		return this;
	}

	_refresh() {
		this.collections.clear();
		this.totals.clear();
		this.fetch({ state: { cacheKey: '?' } });
		this.selectedKeys = [];
	}

	setSelectedKeys(selectedKeys = []) {
		this.selectedKeys = selectedKeys;
	}

	clearSelectedKeys() {
		this.selectedKeys = [];
	}

	findItemByKey(key) {
		deprecated('store.findItemByKey()', 'store.getData()');
		return this.getData(key);
	}

	getData(key) {
		const { collection, uniqueKey, selectedKeys } = this;
		if (isUndefined(key)) {
			key = selectedKeys[0];
		}
		if (isUndefined(key) || !collection) {
			return null;
		}
		return collection.find(
			(dataItem, index) => key === (uniqueKey ? dataItem[uniqueKey] : index)
		);
	}

	async create(options = {}) {
		await this.request({
			method: 'POST',
			...options,
			body: this.tableConfig.mapOnSave(options.body, 'create'),
			errorTitle: '创建失败',
			refresh: true,
		});
	}

	async update(options = {}) {
		await this.request({
			method: 'PUT',
			...options,
			body: this.tableConfig.mapOnSave(options.body, 'update'),
			errorTitle: '修改失败',
			refresh: true,
		});
	}

	async remove(options = {}) {
		await this.request({
			method: 'DELETE',
			...options,
			errorTitle: '删除失败',
			refresh: true,
		});
	}

	async request(options = {}) {
		const {
			errorTitle = '操作失败',
			refresh = false,
			throwError = false,
			...requestOptions
		} = options;
		try {
			const res = await this._request.fetch(requestOptions);
			if (refresh && refresh !== 'no') {
				this._refresh();
			}
			return res;
		} catch (err) {
			if (throwError) {
				throw err;
			}
			showError(errorTitle, err);
		}
	}
}
