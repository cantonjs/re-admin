import { MODAL, TOOLBAR } from 'utils/Issuers';
import { UPDATE, CREATE, REF } from 'constants/Actions';
import joinKeys from 'utils/joinKeys';
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

	ref = (params = {}) => {
		const { modal = {}, ...otherParams } = params;
		return this.dispatch(UPDATE, {
			fetch: 'fetch',
			save: 'request',
			...otherParams,
			modal: {
				width: 880,
				...modal,
			},
		});
	};

	open = (name, params = {}, options) => {
		const { pageContext, modalStore, issuers } = this.props;
		const keys = this.selectedKeysString;

		if (
			pageContext.useDetail &&
			(name === CREATE || name === UPDATE) &&
			issuers.has(TOOLBAR) &&
			!issuers.has(MODAL)
		) {
			const path =
				params.path || (name === UPDATE ? `/update/${keys}` : '/create');
			routerStore.location.pathname += path;
		} else {
			modalStore.open(
				{
					keys,
					...params,
					name,
				},
				options
			);
			return modalStore.close.bind(modalStore);
		}
	};

	openCreaterModal = (params = {}, options) => {
		params.keys = params.keys || '';
		return this.open(CREATE, params, options);
	};

	openUpdaterModal = (params = {}, options) => {
		const { select, ...config } = params;
		if (select && select.length) {
			config.select = select.join(',');
		}
		return this.open(UPDATE, config, options);
	};

	openRefModal = (params = {}, options) => {
		const {
			noQuery,
			fetch = 'fetch',
			save = 'request',
			width = 880,
			...other
		} = params;
		const config = { fetch, save, width, ...other };
		if (noQuery) config.noQuery = '✓';
		return this.open(REF, config, options);
	};
}
