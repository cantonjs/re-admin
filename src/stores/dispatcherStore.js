import { observable } from 'mobx';
import getRequest from 'utils/getRequest';
import DataListStore from 'stores/DataListStore';
import DataDetailStore from 'stores/DataDetailStore';

class DispatcherStore {
	init(appConfig, authStore) {
		this.appConfig = appConfig;
		this.authStore = authStore;
		this.baseRequest = getRequest(appConfig);
		this.stores = {
			list: observable.map(),
			detail: observable.map(),
		};
	}

	ensureStore(name, options = {}) {
		const { type = 'list', config, useCache, router } = options;

		const createStore = () => {
			const { appConfig, authStore, baseRequest } = this;
			const Store = type === 'list' ? DataListStore : DataDetailStore;
			return new Store({
				name,
				appConfig,
				authStore,
				baseRequest,
				config,
				router,
			});
		};

		if (!~['list', 'detail'].indexOf(type)) {
			throw new Error(
				`Only type "list" or "detail" is valid, but received "${type}"`
			);
		}
		const stores = this.stores[type];
		if (useCache) {
			if (stores.has(name)) {
				return stores.get(name);
			} else {
				const store = createStore();
				stores.set(name, store);
				return store;
			}
		} else {
			return createStore();
		}
	}
}

export default new DispatcherStore();
