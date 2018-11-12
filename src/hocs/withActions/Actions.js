import { MODAL, TOOLBAR } from 'utils/Issuers';
import { UPDATE, CREATE, REF } from 'constants/Actions';
import joinKeys from 'utils/joinKeys';
import deprecated from 'utils/deprecated';
import routerStore from 'stores/routerStore';

export default class Actions {
	get props() {
		return this._reactInstance.props;
	}

	get store() {
		return this.props.store;
	}

	get issuers() {
		return this.props.issuers;
	}

	get pageContext() {
		return this.props.pageContext;
	}

	get selectedKeys() {
		const { store, tableRowKey } = this.props;
		return tableRowKey ? [tableRowKey] : store.selectedKeys;
	}

	get selectedKeysString() {
		return joinKeys(this.selectedKeys);
	}

	get selectedKeysHead() {
		return this.selectedKeys.length ? this.selectedKeys[0] : undefined;
	}

	constructor(reactInstance) {
		this._reactInstance = reactInstance;
	}

	getSelectedKeysString = () => this.selectedKeysString;

	getData = () => this.store.getData(this.selectedKeysHead);

	dispatch = (name, modalParams) => {
		const { pageContext, modalStore, issuers, enforceModal } = this.props;
		const keys = this.selectedKeysString;
		if (
			!enforceModal &&
			!modalParams &&
			pageContext.useDetail &&
			(name === CREATE || name === UPDATE) &&
			issuers.has(TOOLBAR) &&
			!issuers.has(MODAL)
		) {
			const path = name === UPDATE ? `/update/${keys}` : '/create';
			routerStore.location.pathname += path;
		} else {
			modalStore.open({
				keys,
				...modalParams,
				name,
			});
			return modalStore.close.bind(modalStore);
		}
	};

	create = (modalParams) => {
		return this.dispatch(CREATE, modalParams);
	};

	update = (modalParams) => {
		return this.dispatch(UPDATE, modalParams);
	};

	ref = (modalParams) => {
		return this.dispatch(UPDATE, {
			fetch: 'fetch',
			save: 'request',
			width: 880,
			...modalParams,
		});
	};

	open = deprecated((name, params = {}) => {
		const { modalStore } = this.props;
		const keys = this.selectedKeysString;
		modalStore.open({
			keys,
			...params,
			name,
		});
		return modalStore.close.bind(modalStore);
	}, '`open()` is deprecated, please use dispatch() instead');

	openCreaterModal = deprecated((params = {}) => {
		return this.open(CREATE, params);
	}, '`openCreaterModal()` is deprecated, please use create() instead');

	openUpdaterModal = deprecated((params = {}) => {
		const { select, ...otherParams } = params;
		if (select && select.length) {
			otherParams.select = select.join(',');
		}
		return this.open(UPDATE, otherParams);
	}, '`openUpdaterModal()` is deprecated, please use update() instead');

	openRefModal = deprecated((params = {}) => {
		const { fetch = 'fetch', save = 'request', width = 880, ...other } = params;
		const config = { fetch, save, width, ...other };
		return this.open(REF, config);
	}, '`openRefModal()` is deprecated, please use ref() instead');
}
