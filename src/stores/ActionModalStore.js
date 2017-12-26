
import { computed } from 'mobx';
import { omitBy, reduce } from 'lodash';

export default class ModalStore {
	static prefix = '__';

	static getOmitPaths = (val, key) => {
		return key.startsWith(ModalStore.prefix);
	};

	@computed get state() {
		const prefixLength = ModalStore.prefix.length;
		const { query } = this.routerStore.location;
		return reduce(query, (state, val, key) => {
			if (key.startsWith(ModalStore.prefix)) {
				const stateKey = key.substr(prefixLength);
				state[stateKey] = val;
			}
			return state;
		}, {});
	};

	set state(state) {
		const stateQuery = reduce(state, (query, val, key) => {
			query[`${ModalStore.prefix}${key}`] = val;
			return query;
		}, {});
		const { location } = this.routerStore;
		location.query = { ...location.query, ...stateQuery };
	}

	constructor(routerStore) {
		this.routerStore = routerStore;
	}

	close = () => {
		const { location } = this.routerStore;
		location.query = {
			...omitBy(
				location.query,
				(val, key) => key.startsWith(ModalStore.prefix),
			),
		};
	};
}
