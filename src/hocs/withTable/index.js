import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import { withStoreProvider } from 'hocs/withStore';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';

export default function withTable(options = {}) {
	const { syncLocation, useCache } = options;

	return function createWithTableComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withStoreProvider({ useCache, router: syncLocation ? routerStore : null })
		@observer
		class WithTable extends Component {
			static propTypes = {
				table: PropTypes.string,
				store: PropTypes.object,
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
				const { table, store } = this.props;
				if (table && store) {
					this._disposer = store.observeQuery(({ newValue }) => {
						store.fetch({ query: newValue });
					});
					// FIXME: should fix when routes changed
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
