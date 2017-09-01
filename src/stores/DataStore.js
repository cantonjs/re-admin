
// import React from 'react';
import { observable, computed, toJS } from 'mobx';
import { omit, isString, isNumber, assign } from 'lodash';
import getAsk from 'utils/getAsk';
import showError from 'utils/showError';
import jsxToPlainObject from 'utils/jsxToPlainObject';

const caches = {};
let appConfig = {};
let authStore = {};

export default class DataStore {
	static get(table) {
		const tableConfig = appConfig.tables[table];
		if (caches.hasOwnProperty(table)) { return caches[table]; }

		const schema = jsxToPlainObject(tableConfig.data);
		const store = new DataStore(table, schema, tableConfig);
		caches[table] = store;
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

	@computed get collection() {
		return this.collections.get(this.search);
	}

	@computed get total() {
		return this.totals.get(this.search) || 0;
	}

	@computed get dataSource() {
		return toJS(this.collection);
	}

	collections = observable.map();
	totals = observable.map();

	_prevQuery = {};
	_pervSearch = '?';

	constructor(table, schema, tableConfig) {
		this._table = table;
		this._schema = schema;
		this._tableConfig = tableConfig;


		this.columns = schema
			.filter(({ shouldHideInTable }) => !shouldHideInTable)
			.map(({ render, ...props }) => ({
				title: props.label,
				key: props.name,
				dataIndex: props.name,
				render: render ? (...args) => render(...args, props) : undefined,
			}))
		;

		// this.columns = tableConfig
		// 	.tableList
		// 	.map(({ Component, props }) => ({
		// 		title: props.label,
		// 		key: props.name,
		// 		dataIndex: props.name,
		// 		render: function RenderComponent(text, record, index) {
		// 			return (
		// 				<Component
		// 					{...props}
		// 					text={text}
		// 					record={record}
		// 					index={index}
		// 				/>
		// 			);
		// 		},
		// 	}))
		// ;

		const unique = schema.find((s) => s.unique);
		this._uniqueKey = unique && unique.name;

		const { pathname, query, headers } = tableConfig.apiLoc;

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
			} = await this._tableConfig.mapOnFetchResponse(res);

			const collection = list.map((data, index) => {
				data.key = this._uniqueKey ? data[this._uniqueKey] : index;
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
			const data = await this._tableConfig.mapOnFetchOneResponse(res);
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
		const { collection, _uniqueKey } = this;
		if (!collection) { return []; }
		return collection.find((item, index) =>
			key === (_uniqueKey ? item[_uniqueKey] : index)
		);
	}

	async create(body) {
		try {
			await this._ask.fork({
				method: 'POST',
				body: this._tableConfig.mapOnSave(body, 'create'),
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
				body: this._tableConfig.mapOnSave(body, 'update'),
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
