import { computed, observable, action } from 'mobx';
import { omitBy, reduce } from 'lodash';

export default class ModalStore {
	static prefix = '__';

	static getOmitPaths(val, key) {
		return key.startsWith(ModalStore.prefix);
	}

	@observable modalProps = {};
	@observable state = {};

	_prefix = '__';

	@computed
	get name() {
		return this.state.name;
	}

	@computed
	get visible() {
		return !!this.name;
	}

	constructor(parent, router) {
		this.parent = parent;
		if (router) {
			this._bindRouter(router);
			this._router = router;
		}
	}

	close() {
		if (this._router) this._clearLocation();
		else this.state = {};
	}

	@action
	setState(state) {
		if (this._router) this._setLocation(state);
		else this.state = state;
	}

	@action
	setModalProps(props) {
		const ensureNumber = function ensureNumber(propName) {
			const val = props[propName];
			if (val && /^\d+$/.test(val)) {
				props[propName] = +val;
			}
		};
		const ensureBoolean = function ensureBoolean(propName) {
			if (!props.hasOwnProperty(propName)) {
				return;
			}
			const val = props[propName];
			if (val === 'false' || val === 'no') {
				props[propName] = false;
			} else if (val) {
				props[propName] = true;
			}
		};
		ensureNumber('width');
		ensureNumber('zIndex');
		ensureBoolean('closable');
		ensureBoolean('confirmLoading');
		ensureBoolean('mask');
		ensureBoolean('maskClosable');
		this.modalProps = props;
	}

	_bindRouter(router) {
		if (this._router) return;
		const handleQueryChange = ({ query }) => {
			const prefixLength = ModalStore.prefix.length;
			this.state = reduce(
				query,
				(state, val, key) => {
					if (key.startsWith(ModalStore.prefix)) {
						const stateKey = key.substr(prefixLength);
						state[stateKey] = val;
					}
					return state;
				},
				{}
			);
		};

		router.history.listen(handleQueryChange);
		handleQueryChange(router.location);

		this._setLocation = (state) => {
			const modalQuery = reduce(
				state,
				(query, val, key) => {
					query[`${ModalStore.prefix}${key}`] = val;
					return query;
				},
				{}
			);
			const { location } = router;
			location.query = { ...location.query, ...modalQuery };
		};

		this._clearLocation = () => {
			const { location } = router;
			location.query = omitBy(location.query, (val, key) =>
				key.startsWith(ModalStore.prefix)
			);
		};
	}
}
