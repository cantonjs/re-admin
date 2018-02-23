import { computed, observable } from 'mobx';
import { omitBy, reduce } from 'lodash';

class ModalLocationBridgeStore {
	@computed
	get state() {
		const prefixLength = this._prefix.length;
		const { query } = this._loc;
		return reduce(
			query,
			(state, val, key) => {
				if (key.startsWith(this._prefix)) {
					const stateKey = key.substr(prefixLength);
					state[stateKey] = val;
				}
				return state;
			},
			{}
		);
	}
	set state(state) {
		const stateQuery = reduce(
			state,
			(query, val, key) => {
				query[`${this._prefix}${key}`] = val;
				return query;
			},
			{}
		);
		this._loc.query = { ...this._loc.query, ...stateQuery };
	}

	constructor(location, prefix) {
		this._loc = location;
		this._prefix = prefix;
	}
}

class ModalMemoryStore {
	@observable state = {};
}

class ModalStore {
	@observable modalProps = {};
	@observable state = {};

	prefix = '__';

	getOmitPaths = (val, key) => {
		return key.startsWith(this.prefix);
	};

	// @computed
	// get state() {
	// 	return this._mem;
	// }
	// set state(state) {
	// 	this._mem.state = state;
	// }

	onOk() {}
	onCancel() {}

	@computed
	get name() {
		return this.state.name;
	}

	@computed
	get visible() {
		return !!this.name;
	}

	close = () => {
		this.state = {};
	};

	bindLocation(location) {
		this._loc = new ModalLocationBridgeStore(location, this.prefix);
	}

	constructor() {
		// this._mem = new ModalMemoryStore();
	}
}

export default new ModalStore();
