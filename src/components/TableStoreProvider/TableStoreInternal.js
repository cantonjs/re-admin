import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import StoreContext from 'contexts/Store';
import routerStore from 'stores/routerStore';
import authStore from 'stores/authStore';
import tableStoreCache from './tableStoreCache';

@polyfill
export default class TableStoreInternal extends PureComponent {
	static propTypes = {
		children: PropTypes.func.isRequired,
		appConfig: PropTypes.object.isRequired,
		store: PropTypes.object,
		parentStore: PropTypes.object,
		table: PropTypes.string,
		type: PropTypes.string,
		useCache: PropTypes.bool,
		useRouter: PropTypes.bool,
		syncLocation: PropTypes.bool,
	};

	static getDerivedStateFromProps({ table }, prevState) {
		if (!prevState.table || prevState.table === table) return null;
		return { store: prevState.getStore(table) };
	}

	constructor(props, context) {
		super(props, context);
		const { table, parentStore } = props;
		const state = { store: null, getStore: this._getStore };
		if (table) state.store = this._getStore();
		else if (props.store) state.store = props.store;
		if (!state.store && parentStore) state.store = parentStore;
		this.state = state;
	}

	componentWillUnmount() {
		const { store } = this;
		store && store.unmount();
	}

	_getStore = () => {
		const {
			table,
			useCache,
			useRouter,
			syncLocation,
			type,
			appConfig,
		} = this.props;
		const store = tableStoreCache.ensureStore(table, {
			useCache,
			router: useRouter || syncLocation ? routerStore : null,
			type,
			authStore,
			appConfig,
		});
		store.mount();
		return store;
	};

	render() {
		const {
			state: { store },
			props: { children },
		} = this;
		return (
			<StoreContext.Provider value={store}>
				{children({ store })}
			</StoreContext.Provider>
		);
	}
}
