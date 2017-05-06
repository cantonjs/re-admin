
import { observable } from 'mobx';
import schema from 'config/schemas/test/data';

import fakeFetch from 'utils/fakeFetch';

class Store {
	@observable collection = [];

	constructor() {
		this.columns = schema.map(({ title, key, render }) => ({
			title,
			key,
			render,
			dataIndex: key,
		}));
	}

	async fetch() {
		const collection = await fakeFetch();
		this.collection = collection;
		return this;
	}
}

export default new Store();
