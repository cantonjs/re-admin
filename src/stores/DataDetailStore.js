import { observable, computed, toJS } from 'mobx';
import { omitBy, isUndefined } from 'lodash';
import BaseDataStore from 'stores/BaseDataStore';

export default class DataDetailStore extends BaseDataStore {
	@observable isFetching = false;
	cache = observable.map();

	@computed
	get cacheKey() {
		return JSON.stringify(toJS(this.query));
	}

	@computed
	get data() {
		return this.cache.get(this.cacheKey);
	}

	async fetch(options = {}) {
		const { query = {}, method, url, body, headers } = options;

		if (this.cache.has(url)) {
			return this;
		}

		this.isFetching = true;

		const fetchOptions = {
			method,
			url,
			body,
			headers,
			query,
		};
		const res = await this.request(omitBy(fetchOptions, isUndefined));
		const data = await this.config.mapOnFetchOneResponse(res);
		this.cache.set(url, data);

		this.isFetching = false;
		return this;
	}

	refresh() {
		this.cache.clear();
		this.fetch();
	}
}
