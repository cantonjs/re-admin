
import { observable, computed, toJS } from 'mobx';
import schema from 'config/schemas/test/data';

import fakeFetch from 'utils/fakeFetch';

class Store {
	@observable collection = [];
	@observable isFetching = false;

	@computed get dataSource() {
		return toJS(this.collection);
	}

	constructor() {
		this.columns = schema.map(({ title, key, render }) => ({
			title,
			key,
			render,
			dataIndex: key,
		}));
	}

	async fetch() {
		this.isFetching = true;
		const collection = await fakeFetch();
		this.isFetching = false;
		this.collection = collection.map((data, index) => {

			// TODO: should depend on `schema.unique`
			data.key = data.key || index;

			return data;
		});
		return this;
	}
}

export default new Store();
