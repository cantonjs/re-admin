import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CREATER } from 'utils/Issuers';
import { isFunction } from 'lodash';
import hoist, { extractRef } from 'hocs/hoist';
import { withStoreProvider } from 'hocs/withStore';
import withIssuer from 'hocs/withIssuer';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';

export default function withTable(options = {}) {
	const { syncLocation, useCache, type } = options;

	return function createWithTableComponent(WrappedComponent) {
		@withIssuer()
		@hoist(WrappedComponent)
		@withStoreProvider({
			useCache,
			router: syncLocation ? routerStore : null,
			type,
		})
		@observer
		class WithTable extends Component {
			static propTypes = {
				table: PropTypes.string,
				store: PropTypes.object,
				issuers: PropTypes.instanceOf(Set).isRequired,
			};

			// DEPRECATED
			static childContextTypes = {
				store: PropTypes.object,
			};

			// DEPRECATED
			getChildContext() {
				return {
					store: this.props.store,
				};
			}

			componentDidMount() {
				const { table, store, issuers } = this.props;
				if (table && store) {
					this._disposer = store.observeQuery(({ newValue }) => {
						if (!issuers.has(CREATER)) {
							store.fetch({ query: newValue });
						}
						if (isFunction(store.clearSelectedKeys)) store.clearSelectedKeys();
					});
					if (syncLocation) store.query = routerStore.location.query;
				}
			}

			componentWillUnmount() {
				this._disposer && this._disposer();
			}

			render() {
				return <WrappedComponent {...extractRef(this.props)} />;
			}
		}

		return WithTable;
	};
}
