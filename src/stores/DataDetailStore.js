import { observable, computed, toJS } from 'mobx';
import { omitBy, isUndefined } from 'lodash';

export default class DataDetailStore {
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

	constructor(service) {
		const { tableConfig, baseRequest } = service;
		this.service = service;
		this.tableConfig = tableConfig;
		this.request = baseRequest.fetch.bind(baseRequest);
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
		const data = await this.tableConfig.mapOnFetchOneResponse(res);
		this.cache.set(url, data);

		this.isFetching = false;
		return this;
	}

	refresh() {
		this.cache.clear();
		this.fetch();
	}
}
