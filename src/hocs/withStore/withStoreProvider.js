import React, { Component } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import StoreContext from './StoreContext';
import withStore from './withStore';
import dispatcherStore from 'stores/dispatcherStore';

export default function withStoreProvider(options = {}) {
	const { useCache, prop = 'store' } = options;
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
				let store;
				if (table) store = this._getStore(table);
				else if (parentStore) store = parentStore;
				state[prop] = store;
				this.state = state;
			}

			_getStore = (table) => {
				return dispatcherStore.ensureStore(table, { useCache });
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
