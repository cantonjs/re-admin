
import { observable, extendObservable, computed } from 'mobx';
import schema from 'config/schemas/test/data';

import fakeFetch from 'utils/fakeFetch';

class Store {
	constructor(data = {}) {
		const ext = schema.reduce((ext, { key, name }) => {

			// TODO: should depend on `dataType`
			ext[key] = {
				name,
				value: data[key],
			};
			return ext;

		}, {});

		extendObservable(this, ext);
	}
}

class Stores {
	data = observable.map();

	@computed get collection() {
		return this.data.values();
	}

	async fetch() {
		const list = await fakeFetch();
		list.forEach((data) => {
			this.data.set(data.id, new Store(data));
		});
		return this;
	}
}

export default new Stores();
