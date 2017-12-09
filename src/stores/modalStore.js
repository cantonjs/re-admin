
import { computed } from 'mobx';
import routerStore from 'stores/routerStore';
import { omitBy, reduce, noop } from 'lodash';

class ModalStore {
	_okHandler = noop;

	prefix = '__';

	@computed get state() {
		const prefixLength = this.prefix.length;
		const { query } = this.routerStore.location;
		return reduce(query, (state, val, key) => {
			if (key.startsWith(this.prefix)) {
				const stateKey = key.substr(prefixLength);
				state[stateKey] = val;
			}
			return state;
		}, {});
	};

	set state(state) {
		const stateQuery = reduce(state, (query, val, key) => {
			query[`${this.prefix}${key}`] = val;
			return query;
		}, {});
		const { location } = this.routerStore;
		location.query = { ...location.query, ...stateQuery };
	}

	constructor(routerStore) {
		this.routerStore = routerStore;
	}

	close() {
		const { location } = this.routerStore;
		location.query = {
			...omitBy(
				location.query,
				(val, key) => key.startsWith(this.prefix),
			),
		};
	}

	onOk = (handler) => {
		this._okHandler = handler;
		return this.offOk;
	};

	offOk = () => {
		this._okHandler = noop;
	};

	emitOk() {
		this._okHandler();
	}

	getOmitPaths = (val, key) => {
		return key.startsWith(this.prefix);
	};
}

export default new ModalStore(routerStore);
