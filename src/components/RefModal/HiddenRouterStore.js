
import { observable, computed } from 'mobx';

class LocStore {
	@observable _query = { page: 1 };

	@computed get query() {
		return this._query;
	}

	set query(query) {
		const state = this._modalState;
		const method = state.fetch || 'fetch';
		this._query = query;
		this._dataStore.call(method, { ...state, query });
		return query;
	}

	constructor(dataStore, modalState) {
		this._dataStore = dataStore;
		this._modalState = modalState;
	}
}

export default class HiddenRouterStore {
	constructor(dataStore, modalState) {
		this.location = new LocStore(dataStore, modalState);
	}
}
