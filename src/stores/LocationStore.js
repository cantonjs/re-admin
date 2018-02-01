import { observable, computed } from 'mobx';

export default class LocationStore {
	@observable _query = {};

	@computed
	get query() {
		return this._query;
	}

	set query(query) {
		this._query = query;
		this._listener(query);
		return query;
	}

	constructor(listener) {
		this._listener = listener;
	}
}
