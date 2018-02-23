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
		// this.state = {};
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
		const { width } = props;
		if (width && /^\d+$/.test(width)) {
			props.width = +width;
		}
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
