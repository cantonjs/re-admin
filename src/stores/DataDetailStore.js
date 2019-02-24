import { observable, computed, action, runInAction, toJS } from 'mobx';
import { omitBy, isUndefined } from 'utils/fp';
import BaseDataStore from 'stores/BaseDataStore';
import joinKeys from 'utils/joinKeys';

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

	@action
	async fetch(options = {}) {
		const {
			query = {},
			method,
			url = joinKeys(this.selectedKeys),
			body,
			headers,
		} = options;

		const {
			cacheKey,
			config: { mapOnFetchOneRequest, mapOnFetchOneResponse },
		} = this;
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey);
		}

		this.isFetching = true;

		const fetchOptions = {
			method,
			url,
			body,
			headers,
			query,
		};
		const res = await this.request(
			omitBy(mapOnFetchOneRequest(fetchOptions), isUndefined)
		);
		const data = await mapOnFetchOneResponse(res);
		runInAction(() => {
			this.cache.set(cacheKey, data);
			this.isFetching = false;
		});
		return data;
	}

	@action
	setSelectedKeys(keys) {
		this.selectedKeys = keys;
	}

	@action
	clearCache() {
		this.cache.clear();
	}

	@action
	refresh() {
		this.clearCache();
		this.call('fetch');
	}

	getData() {
		return this.data;
	}
}
