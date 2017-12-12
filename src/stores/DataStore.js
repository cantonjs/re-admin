
import { observable, computed, toJS } from 'mobx';
import { omit, assign } from 'lodash';
import getRequest from 'utils/getRequest';
import showError from 'utils/showError';
import routerStore from 'stores/routerStore';

const caches = observable.map();
let appConfig = {};
let authStore = {};

export default class DataStore {
	static get(tableName, customConfig) {
		if (caches.has(tableName)) { return caches.get(tableName); }
		const store = new DataStore(tableName, customConfig);
		caches.set(tableName, store);
		return store;
	}

	static setup(config, auth) {
		appConfig = config;
		authStore = auth;
	}

	@observable isFetching = false;
	@observable search = '?';
	@observable selectedKeys = [];
	@observable data = {};

	@computed get tableConfig() {
		return {
			...appConfig.tables[this._tableName],
			...this._customConfig,
		};
	}

	@computed get collection() {
		return this.collections.get(this.search);
	}

	@computed get total() {
		return this.totals.get(this.search) || 0;
	}

	@computed get dataSource() {
		return toJS(this.collection);
	}

	@computed get sortedKey() {
		return routerStore.location.query[appConfig.api.sortKey];
	}

	@computed get sortedOrder() {
		const { orderKey, ascValue } = appConfig.api;
		const { query } = routerStore.location;
		let order = query[orderKey];

		if (!this.sortedKey) { return order; }

		/* eslint-disable eqeqeq */
		return order == ascValue ? 'ascend' : 'descend';
	}

	@computed get columns() {
		return this
			.tableConfig
			.tableRenderers
			.map(({ render, props, options }) => {
				const column = {
					title: props.label,
					key: props.name,
					dataIndex: props.name,
					render: function renderTable(text, record, index) {
						return render(props, {
							...options,
							text,
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
			})
		;
	}

	@computed get maxSelections() {
		return this.tableConfig.maxSelections;
	}

	@computed get queryRenderers() {
		return this
			.tableConfig
			.queryRenderers
		;
	}

	@computed get formRenderers() {
		return this
			.tableConfig
			.formRenderers
		;
	}

	collections = observable.map();
	totals = observable.map();

	_prevQuery = {};
	_pervSearch = '?';

	constructor(tableName, customConfig = {}) {
		this._tableName = tableName;
		this._customConfig = customConfig;

		const { tableRenderers, queryRenderers, extend } = this.tableConfig;
		const sortableField = tableRenderers.find(({ props }) => props.sortable);

		const { pathname, query, headers } = this.tableConfig.api;

		this.uniqueKey = this.tableConfig.uniqueKey;
		this.hasSortableField = !!sortableField;
		this.hasQueryField = !!queryRenderers.length;
		this.pathname = pathname;

		assign(this, extend);

		this.size = +(query.count || appConfig.api.count);

		this._request = getRequest(appConfig).clone({
			url: pathname,
			headers,
			queryTransformer: (reqQuery) => assign({}, query, reqQuery),
		});

		const { accessTokenLocation } = appConfig.api;
		const fetchAuthTransformerName = accessTokenLocation === 'query' ?
			'addQueryTransformer' : 'addHeadersTransformer';

		this._request[fetchAuthTransformerName]((queryOrHeaders) => {
			const { accessToken } = authStore;
			if (accessToken) {
				queryOrHeaders[appConfig.api.accessTokenName] = accessToken;
			}
			return queryOrHeaders;
		});
	}

	async fetch(query = this._prevQuery, search = this._prevSearch) {
		this._prevQuery = query;
		this._prevSearch = search;

		const page = (function () {
			const p = query.page || 1;
			return p < 1 ? 1 : p;
		}());

		query = {
			count: this.size,

			// TODO: action?
			...omit(query, ['action']),

			page,
		};

		if (this.collections.has(search)) {
			this.search = search;
			return this;
		}

		this.isFetching = true;

		try {
			const res = await this.request({ query });
			const {
				total,
				list = [],
			} = await this.tableConfig.mapOnFetchResponse(res);

			const collection = list.map((data, index) => {
				data.key = this.uniqueKey ? data[this.uniqueKey] : index;
				return data;
			});

			this.search = search;
			this.collections.set(search, collection);
			this.totals.set(search, total);
		}
		catch (err) {
			showError('请求失败：', err.reason || err.message);
		}

		this.isFetching = false;
		return this;
	}

	async fetchOne(query) {
		try {
			const res = await this.request({ query });
			const data = await this.tableConfig.mapOnFetchOneResponse(res);
			this.data = data;
		}
		catch (err) {
			showError('请求失败：', err.message);
		}
		return this;
	}

	_refresh() {
		this.collections.clear();
		this.totals.clear();
		this.fetch();
		this.selectedKeys = [];
	}

	setSelectedKeys(selectedKeys) {
		this.selectedKeys = selectedKeys;
	}

	findItemByKey(key) {
		const { collection, uniqueKey } = this;
		if (!collection) { return []; }
		return collection.find((item, index) =>
			key === (uniqueKey ? item[uniqueKey] : index)
		);
	}

	async create(options = {}) {
		try {
			await this.request({
				method: 'POST',
				...options,
				body: this.tableConfig.mapOnSave(options.body, 'create'),
			});
			this._refresh();
		}
		catch (err) {
			showError('创建失败：', err.message);
		}
	}

	async update(options = {}) {
		try {
			await this.request({
				method: 'PUT',
				...options,
				body: this.tableConfig.mapOnSave(options.body, 'update'),
			});
			this._refresh();
		}
		catch (err) {
			showError('修改失败：', err.message);
		}
	}

	async remove(options = {}) {
		try {
			await this.request({
				method: 'DELETE',
				...options,
			});
			this._refresh();
		}
		catch (err) {
			showError('删除失败：', err.message);
		}
	}

	async request(options) {
		return this._request.fetch(options);
	}
}
