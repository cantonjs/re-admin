import { computed, observable, action, observe, keys } from 'mobx';
import { omitBy, reduce } from 'lodash';
import Emitter from 'emit-lite';

export default class ModalStore extends Emitter {
	static prefix = '__';

	static getOmitPaths(val, key) {
		return key.startsWith(ModalStore.prefix);
	}

	@observable state = {};
	@observable modalProps = {};

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
		super();

		this.parent = parent;
		this._router = router;
		this._bindRouter();

		this._observeDisposer = observe(this, ({ name, newValue }) => {
			if (name === 'state' && !keys(newValue).length) {
				this.emit('close');
			}
		});
	}

	@action
	destroy() {
		this._observeDisposer();
		this._historyDisposer && this._historyDisposer();
		this.state = {};
	}

	@action
	close() {
		if (this._router) this._clearLocation();
		this.state = {};
	}

	@action
	open(state, options = {}) {
		if (options.router && this._router) this._setLocation(state);
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

	_bindRouter() {
		const router = this._router;
		if (!router) return;

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

		this._historyDisposer = router.history.listen(handleQueryChange);

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
