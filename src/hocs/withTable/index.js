import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import { withStoreProvider } from 'hocs/withStore';
import { observer } from 'mobx-react';
import { omitBy, isEqual } from 'lodash';
import ModalStore from 'stores/ModalStore';
import routerStore from 'stores/routerStore';

export default function withTable(options = {}) {
	const { syncLocation, useCache } = options;
	const router = syncLocation ? routerStore : {};

	return function createWithTableComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withStoreProvider({ useCache })
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

			constructor(props, context) {
				super(props, context);
				const { store, table } = props;
				const { history } = router;
				if (store) {
					this._removeQueryListener = store.addQueryListener(router);
				}
				if (table && history) {
					this._unlistenHistory = history.listen((location, prevLocation) => {
						if (location.pathname === prevLocation.pathname) {
							const { getOmitPaths } = ModalStore;
							const prevQuery = omitBy(prevLocation.query, getOmitPaths);
							const nextQuery = omitBy(location.query, getOmitPaths);
							if (!isEqual(prevQuery, nextQuery)) {
								this._setQuery(nextQuery);
							}
						}
					});
				}
			}

			componentDidMount() {
				const { location } = router;

				if (this.props.table && location) {
					const { getOmitPaths } = ModalStore;
					const query = omitBy(location.query, getOmitPaths);
					this._setQuery(query);
				}
			}

			componentWillUnmount() {
				this._removeQueryListener && this._removeQueryListener();
				this._unlistenHistory && this._unlistenHistory();
			}

			_setQuery(query) {
				const { store } = this.props;
				store.query = query;
			}

			render() {
				return <WrappedComponent {...extractRef(this.props)} />;
			}
		}

		return WithTable;
	};
}
