import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import StoreContext from 'contexts/Store';
import withStore from './withStore';
import dispatcherStore from 'stores/dispatcherStore';
import routerStore from 'stores/routerStore';

export default function withStoreProvider(options = {}) {
	const {
		useCache,
		syncLocation,
		prop = 'store',
		type,
		table: tableOption,
	} = options;
	return function createStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withStore({ prop: 'parentStore' })
		@polyfill
		class WithStoreProvider extends Component {
			static propTypes = {
				table: PropTypes.string,
				parentStore: PropTypes.object,
			};

			static getDerivedStateFromProps({ table }, prevState) {
				return prevState.table && prevState.table !== table ?
					{
						[prop]: prevState.getStore(table),
					} :
					null;
			}

			constructor(props, context) {
				super(props, context);
				const { table, parentStore } = props;
				const state = { table, getStore: this._getStore };
				const targetTable = tableOption || table;
				let store;
				if (targetTable) store = this._getStore(targetTable);
				if (parentStore) {
					if (store) store.parent = parentStore;
					else store = parentStore;
				}
				state[prop] = store;
				this.state = state;
			}

			componentWillUnmount() {
				const store = this.state[prop];
				store && store.unmount();
			}

			_getStore = (table) => {
				const store = dispatcherStore.ensureStore(table, {
					useCache,
					router: syncLocation ? routerStore : null,
					type,
				});
				store.mount();
				return store;
			};

			render() {
				const { state, props: { parentStore, ...props } } = this;
				const newProps = { [prop]: state[prop] };
				return (
					<StoreContext.Provider value={state[prop]}>
						<WrappedComponent {...extractRef(props)} {...newProps} />
					</StoreContext.Provider>
				);
			}
		}
		return WithStoreProvider;
	};
}
