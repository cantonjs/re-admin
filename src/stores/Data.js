
import { observable, computed, toJS } from 'mobx';
import authStore from 'stores/auth';
import getDataSchema from 'utils/getDataSchema';
import { omit } from 'lodash';
import { base } from 'utils/asks';
import showError from 'utils/showError';
import getAppConfig from 'utils/getAppConfig.js';

const caches = {};

export default class DataStore {
	static get(table) {
		const schema = getDataSchema(table);
		// console.log('schema', schema);
		if (caches.hasOwnProperty(table)) { return caches[table]; }

		const store = new DataStore(table, schema);
		caches[table] = store;
		return store;
	}

	@observable total = 0;
	@observable isFetching = false;
	@observable search = '?';
	@observable selectedKeys = [];

	@computed get collection() {
		return this.collections.get(this.search);
	}

	@computed get dataSource() {
		return toJS(this.collection);
	}

	@computed get selection() {
		const { selectedKeys, collection, _uniqueKey } = this;
		if (!collection) { return []; }
		return this.collection.filter((item, index) =>
			selectedKeys.includes(_uniqueKey ? item[_uniqueKey] : index)
		);
	}

	collections = observable.map();

	size = getAppConfig().api.count;
	_prevQuery = {};
	_pervSearch = '?';

	constructor(table, schema) {
		this._table = table;
		this._schema = schema;
		this.columns = schema
			.filter(({ shouldHideInTable }) => !shouldHideInTable)
			.map(({ render, ...props }) => ({
				title: props.label,
				key: props.name,
				dataIndex: props.name,
				render: render ? (...args) => render(...args, props) : undefined,
			}))
		;

		const unique = schema.find((s) => s.unique);
		this._uniqueKey = unique && unique.name;

		this._ask = base.clone({
			url: table,
			query: {
				accessToken({ remove }) {
					const token = authStore.getAccessToken();
					if (!token) { remove(); }
					else { return token; }
				},
			}
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
			const { total, list } = await this._ask.fork({ query });

			const collection = list.map((data, index) => {
				data.key = this._uniqueKey ? data[this._uniqueKey] : index;
				return data;
			});

			this.search = search;
			this.total = total;
			this.collections.set(search, collection);
		}
		catch (err) {
			showError('请求失败：', err.message);
		}

		this.isFetching = false;
		return this;
	}

	_sync() {
		this.collections.clear();
		this.fetch();
	}

	setSelectedKeys(selectedKeys) {
		this.selectedKeys = selectedKeys;
	}

	async create(body) {
		try {
			await this._ask.fork({
				method: 'POST',
				body,
			});
			this._sync();
		}
		catch (err) {
			showError('创建失败：', err.message);
		}
	}

	async update(body) {
		try {
			await this._ask.fork({
				url: this.selectedKeys.join(','),
				method: 'PUT',
				body,
			});

			this._sync();
		}
		catch (err) {
			showError('修改失败：', err.message);
		}
	}

	async remove() {
		try {
			await this._ask.fork({
				url: this.selectedKeys.join(','),
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
