
import { observable, computed, toJS } from 'mobx';
import getSchema from 'utils/getSchema';

// TODO
import fakeFetch from 'utils/fakeFetch';

class DataStore {
	@observable total = 0;
	@observable isFetching = false;
	@observable search = '?';
	@observable selectedKeys = [];

	@computed get dataSource() {
		return toJS(this.collections.get(this.search));
	}

	collections = observable.map();

	size = __DEV__ ? 5 : 20;

	constructor(table, schema) {
		this._table = table;
		this._schema = schema;
		this.columns = schema.map(({ title, key, render }) => ({
			title,
			key,
			render,
			dataIndex: key,
		}));
	}

	async fetch(query = {}, search = '?') {
		const page = (function () {
			const p = query.page || 1;
			return p < 1 ? 1 : p;
		}());

		query = {
			count: this.size,
			...query,
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

			// TODO: should depend on `schema.unique`
			data.key = data.key || index;

			return data;
		});

		this.search = search;
		this.isFetching = false;
		this.total = total;
		this.collections.set(search, collection);
		return this;
	}

	setSelectedKeys(selectedKeys) {
		this.selectedKeys = selectedKeys;
	}

	async update(body) {
		console.log(`[fetch] PUT: /${this._table}/${this.selectedKeys.join(',')}`, body);
	}

	async remove() {
		console.log(`[fetch] REMOVE: /${this._table}/${this.selectedKeys.join(',')}`);
	}
}

const caches = {};

export default function getDataStore(table) {
	const schema = getSchema(table);
	if (caches.hasOwnProperty(table)) { return caches[table]; }

	const store = new DataStore(table, schema);
	caches[table] = store;
	return store;
}
