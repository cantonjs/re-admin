import { observable } from 'mobx';
import getRequest from 'utils/getRequest';
import DataListStore from 'stores/DataListStore';
import DataDetailStore from 'stores/DataDetailStore';

class TableStoreCache {
	list = observable.map();
	detail = observable.map();

	ensureStore(name, options = {}) {
		const {
			type = 'list',
			config,
			useCache,
			router,
			appConfig,
			authStore,
		} = options;

		const createStore = () => {
			const Store = type === 'list' ? DataListStore : DataDetailStore;
			return new Store({
				name,
				appConfig,
				authStore,
				baseRequest: getRequest(appConfig),
				config,
				router,
			});
		};

		if (!~['list', 'detail'].indexOf(type)) {
			throw new Error(
				`Only type "list" or "detail" is valid, but received "${type}"`
			);
		}
		const stores = this[type];

		if (useCache) {
			if (stores.has(name)) {
				const store = stores.get(name);
				store.mount();
				return store;
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

export default new TableStoreCache();
