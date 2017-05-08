
import { observable, computed, toJS } from 'mobx';

// TODO
import fakeFetch from 'utils/fakeFetch';

class DataStore {
	@observable total = 0;
	@observable isFetching = false;
	@observable page = 1;

	@computed get dataSource() {
		return toJS(this.collections.get(this.page));
	}

	collections = observable.map();

	size = 20;

	constructor(schema) {
		this._schema = schema;
		this.columns = schema.map(({ title, key, render }) => ({
			title,
			key,
			render,
			dataIndex: key,
		}));
	}

	async fetch(query = {}) {
		const page = (function () {
			const p = query.page || 1;
			return p < 1 ? 1 : p;
		}());

		if (this.collections.has(page)) {
			this.page = page;
			return this;
		}

		this.isFetching = true;

		const { total, list } = await fakeFetch({
			count: this.size,
			page,
		});

		// console.log('list', list);

		const collection = list.map((data, index) => {

			// TODO: should depend on `schema.unique`
			data.key = data.key || index;

			return data;
		});

		this.page = page;
		this.isFetching = false;
		this.total = total;
		this.collections.set(page, collection);
		return this;
	}
}

const caches = new WeakMap();

export default function getDataStore(schema) {
	if (caches.has(schema)) { return caches.get(schema); }

	const store = new DataStore(schema);
	caches.set(schema, store);
	return store;
}
