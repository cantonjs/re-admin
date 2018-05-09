import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import StoreContext from './StoreContext';

export default function withStoreProvider(options = {}) {
	const { useCache, prop = 'store' } = options;
	return function createStoreProviderComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		class WithStoreProvider extends Component {
			static propTypes = {
				table: PropTypes.string,
			};

			static contextTypes = {
				storesDispatcher: PropTypes.object.isRequired,
			};

			constructor(props, context) {
				super(props, context);
				const { table } = props;
				const state = {};
				if (table) {
					const store = this._getStore(table);
					state[prop] = store;
				}
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
				const { state, props } = this;
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
