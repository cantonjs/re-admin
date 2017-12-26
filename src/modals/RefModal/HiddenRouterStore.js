
import { observable, computed } from 'mobx';

class LocStore {
	@observable _query = { page: 1 };

	@computed get query() {
		return this._query;
	}

	set query(query) {
		const props = this._props;
		const method = props.fetch || 'fetch';
		this._query = query;
		this._dataStore.call(method, { ...props, query });
		return query;
	}

	constructor(dataStore, props) {
		this._dataStore = dataStore;
		this._props = props;
	}
}

export default class HiddenRouterStore {
	constructor(dataStore, props) {
		this.location = new LocStore(dataStore, props);
	}
}
