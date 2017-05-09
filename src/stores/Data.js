
import { observable, computed, toJS } from 'mobx';
import getSchema from 'utils/getSchema';
import jsxToPlainObject from 'utils/jsxToPlainObject';
import { omit } from 'lodash';

// TODO
import fakeFetch from 'utils/fakeFetch';

class DataStore {
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

	size = __DEV__ ? 5 : 20;
	_prevQuery = {};
	_pervSearch = '?';

	constructor(table, schema) {
		this._table = table;
		this._schema = schema;
		this.columns = schema
			.filter(({ shouldHideInTable }) => !shouldHideInTable)
			.map(({ label, name, render }) => ({
				title: label,
				key: name,
				dataIndex: name,
				render,
			}))
		;

		const unique = schema.find((s) => s.unique);
		this._uniqueKey = unique && unique.name;
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

		__DEV__ && console.log(`[fetch] GET: /${this._table}`, query);
		const { total, list } = await fakeFetch(query);

		// console.log('list', list);

		const collection = list.map((data, index) => {
			data.key = this._uniqueKey ? data[this._uniqueKey] : index;
			return data;
		});

		this.search = search;
		this.isFetching = false;
		this.total = total;
		this.collections.set(search, collection);
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
		console.log(`[fetch] POST: /${this._table}`, body);
		this._sync();
	}

	async update(body) {
		console.log(`[fetch] PUT: /${this._table}/${this.selectedKeys.join(',')}`, body);
		this._sync();
	}

	async remove() {
		console.log(`[fetch] REMOVE: /${this._table}/${this.selectedKeys.join(',')}`);
		this.selectedKeys = [];
		this._sync();
	}
}

const caches = {};

export default function getDataStore(table) {
	const schema = jsxToPlainObject(getSchema(table));
	// console.log('schema', schema);
	if (caches.hasOwnProperty(table)) { return caches[table]; }

	const store = new DataStore(table, schema);
	caches[table] = store;
	return store;
}
