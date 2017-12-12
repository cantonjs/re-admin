
import { observable, computed } from 'mobx';

class LocStore {
	@observable _query = { page: 1 };

	@computed get query() {
		return this._query;
	}

	set query(query) {
		this._query = query;
		this._dataStore.fetch({ query });
		return query;
	}

	constructor(dataStore) {
		this._dataStore = dataStore;
	}
}

export default class HiddenRouterStore {
	location = new LocStore();

	constructor(dataStore) {
		this.location = new LocStore(dataStore);
	}
}
