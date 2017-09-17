
import { observable, computed, toJS } from 'mobx';
import { omit, isString, isNumber, assign } from 'lodash';
import getAsk from 'utils/getAsk';
import showError from 'utils/showError';
import routerStore from 'stores/routerStore';

const caches = observable.map();
let appConfig = {};
let authStore = {};

export default class DataStore {
	static get(table) {
		if (caches.has(table)) { return caches.get(table); }
		const store = new DataStore(table);
		caches.set(table, store);
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
		return appConfig.tables[this._tableName];
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

	@computed get queryNodes() {
		return this
			.tableConfig
			.queryRenderers
			.map(({ renderNode }) => renderNode())
		;
	}

	@computed get formNodes() {
		return this
			.tableConfig
			.formRenderers
			.map(({ renderNode }) => renderNode())
		;
	}

	collections = observable.map();
	totals = observable.map();

	_prevQuery = {};
	_pervSearch = '?';

	constructor(table) {
		this._tableName = table;

		const { tableRenderers, queryRenderers } = this.tableConfig;
		const sortableField = tableRenderers.find(({ props }) => props.sortable);

		this.uniqueKey = this.tableConfig.uniqueKey;
		this.hasSortableField = !!sortableField;
		this.hasQueryField = !!queryRenderers.length;

		const { pathname, query, headers } = this.tableConfig.api;

		const accessTokenOptions = {
			[appConfig.api.accessTokenName]({ remove }) {
				const { accessToken } = authStore;
				if (!accessToken) { remove(); }
				else { return accessToken; }
			},
		};

		assign(
			appConfig.api.accessTokenLocation === 'query' ? query : headers,
			accessTokenOptions,
		);

		this.size = +(query.count || appConfig.api.count);

		this._ask = getAsk(appConfig).clone({
			url: pathname,
			query,
			headers,
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
			...omit(query, ['action']),
			page,
		};

		if (this.collections.has(search)) {
			this.search = search;
			return this;
		}

		this.isFetching = true;

		try {
			const res = await this._ask.fork({ query });
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
			showError('请求失败：', err.message);
		}

		this.isFetching = false;
		return this;
	}

	async fetchOne(query) {
		try {
			const res = await this._ask.fork({ query });
			const data = await this.tableConfig.mapOnFetchOneResponse(res);
			this.data = data;
		}
		catch (err) {
			showError('请求失败：', err.message);
		}
		return this;
	}

	_sync() {
		this.collections.clear();
		this.totals.clear();
		this.fetch();
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

	async create(body) {
		try {
			await this._ask.fork({
				method: 'POST',
				body: this.tableConfig.mapOnSave(body, 'create'),
			});
			this._sync();
		}
		catch (err) {
			showError('创建失败：', err.message);
		}
	}

	async update(body, keys) {
		try {
			await this._ask.fork({
				url: keys,
				method: 'PUT',
				body: this.tableConfig.mapOnSave(body, 'update'),
			});

			this._sync();
		}
		catch (err) {
			showError('修改失败：', err.message);
		}
	}

	async remove(keys) {
		try {
			if (isNumber(keys) || isString(keys)) { keys = [keys]; }
			if (!Array.isArray(keys)) { keys = this.selectedKeys; }
			if (!keys.length) { return; }

			await this._ask.fork({
				url: keys.join(','),
				method: 'DELETE',
			});
			this._sync();
			this.selectedKeys = [];
		}
		catch (err) {
			showError('删除失败：', err.message);
		}
	}
}
