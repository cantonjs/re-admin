import { computed, observable, action } from 'mobx';
import { omitBy, reduce } from 'lodash';

class ModalStore {
	@observable modalProps = {};
	@observable state = {};

	_prefix = '__';

	getOmitPaths = (val, key) => {
		return key.startsWith(this._prefix);
	};

	@computed
	get name() {
		return this.state.name;
	}

	@computed
	get visible() {
		return !!this.name;
	}

	close() {
		this._clearLocation();
	}

	@action
	setState(state, useLocation) {
		if (useLocation) {
			this._setLocation(state);
		} else {
			this.state = state;
		}
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

	bindRouter(router) {
		if (this._router) {
			return;
		}
		router.history.listen(({ query }) => {
			const prefixLength = this._prefix.length;
			this.state = reduce(
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
		});

		this._setLocation = (state) => {
			const modalQuery = reduce(
				state,
				(query, val, key) => {
					query[`${this._prefix}${key}`] = val;
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
				key.startsWith(this._prefix)
			);
		};
	}
}

export default new ModalStore();
