import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import StoreContext from './StoreContext';
import withStore from './withStore';

export default function withStoreProvider(options = {}) {
	const { useCache, prop = 'store' } = options;
	return function createStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withStore({ prop: 'parentStore' })
		class WithStoreProvider extends Component {
			static propTypes = {
				table: PropTypes.string,
				parentStore: PropTypes.object,
			};

			static contextTypes = {
				storesDispatcher: PropTypes.object.isRequired,
			};

			constructor(props, context) {
				super(props, context);
				const { table, parentStore } = props;
				const state = {};
				let store;
				if (table) store = this._getStore(table);
				else if (parentStore) store = parentStore;
				state[prop] = store;
				this.state = state;
			}

			componentWillReceiveProps({ table }) {
				if (this.props.table && this.props.table !== table) {
					this.setState({
						[prop]: this._getStore(table),
					});
				}
			}

			_getStore(table) {
				const { context: { storesDispatcher } } = this;
				return storesDispatcher.ensureStore(table, { useCache });
			}

			render() {
				const { state, props: { parentStore, ...props } } = this;
				return (
					<StoreContext.Provider value={state[prop]}>
						<WrappedComponent {...extractRef(props)} {...state} />
					</StoreContext.Provider>
				);
			}
		}
		return WithStoreProvider;
	};
}
