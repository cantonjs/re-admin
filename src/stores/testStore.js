
import { observable, extendObservable, computed } from 'mobx';
import schema from 'config/schemas/test/data';

import fakeFetch from 'utils/fakeFetch';

class Store {
	@observable columns = [];
	@observable collection = [];

	constructor() {
		this.columns = schema.map(({ title, key }) => ({
			title,
			key,
			dataIndex: key,
		}));

		console.log('this.columns', this.columns);
	}

	async fetch() {
		const collection = await fakeFetch();
		this.collection = collection;
		return this;
	}
}

export default new Store();
