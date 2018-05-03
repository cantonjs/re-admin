import { computed } from 'mobx';
import { UPDATER, QUERIER } from 'utils/Issuers';
import routerStore from 'stores/routerStore';
import { isUndefined } from 'lodash';

export default class State {
	@computed
	get shouldShow() {
		const { _props: { name }, _context: { modalStore }, _isUpdater } = this;
		if (_isUpdater) {
			const { select } = modalStore.state;
			if (!select) {
				return true;
			} else if (select.split(',').indexOf(name) < 0) {
				return false;
			}
		}
		return true;
	}

	@computed
	get value() {
		const {
			_props: { name, value },
			_context: { store, getParentValue, modalStore },
			_isUpdater,
			_isQuerier,
		} = this;

		if (!isUndefined(value) || !name) {
			return value;
		}

		const { query } = routerStore.location;

		if (_isQuerier) {
			return query[name];
		} else if (_isUpdater) {
			const { keys } = modalStore.state;
			const selectedKeys = (keys || '').split(',');
			if (selectedKeys.length !== 1) {
				return '';
			}
			const item = getParentValue ?
				getParentValue() :
				store.getData(selectedKeys[0]);
			return item ? item[name] : undefined;
		}

		return '';
	}

	constructor(props, context) {
		this._props = props;
		this._context = context;
		const { issuers } = props;
		this._isUpdater = issuers && issuers.has(UPDATER);
		this._isQuerier = issuers && issuers.has(QUERIER);
	}
}
