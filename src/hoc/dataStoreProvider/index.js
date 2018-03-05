import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import modalStore from 'stores/modalStore';
import { omitBy, isEqual } from 'lodash';
import routerStore from 'stores/routerStore';

export default function dataStoreProvider(options = {}) {
	const { bindLocation } = options;
	const router = bindLocation ? routerStore : {};
	return function createDataStoreProviderComponent(WrappedComponent) {
		@observer
		class DataStoreProvider extends Component {
			static propTypes = {
				table: PropTypes.string,
			};

			static childContextTypes = {
				store: PropTypes.object,
				service: PropTypes.object,
			};

			static contextTypes = {
				DataStore: PropTypes.func.isRequired,
			};

			getChildContext() {
				return this.state;
			}

			constructor(props, context) {
				super(props, context);
				const { table } = props;
				const { DataStore } = context;
				const service = DataStore.get(table);

				// TODO: should not use `_table`
				const store = service.stores._table;

				this.state = { service, store };
				this._removeQueryListener = store.addQueryListener(router);
			}

			componentWillMount() {
				const { history } = router;
				if (history) {
					this._unlistenHistory = history.listen((location, prevLocation) => {
						if (location.pathname === prevLocation.pathname) {
							const { getOmitPaths } = modalStore;
							const prevQuery = omitBy(prevLocation.query, getOmitPaths);
							const nextQuery = omitBy(location.query, getOmitPaths);
							if (!isEqual(prevQuery, nextQuery)) {
								this._setQuery(nextQuery);
							}
						}
					});
				}
			}

			componentWillReceiveProps({ table }) {
				const { DataStore } = this.context;
				if (this.props.table && this.props.table !== table) {
					const service = DataStore.get(table);
					this.setState({
						// TODO: should not use `_table`
						store: service.stores._table,

						service,
					});
				}
			}

			componentDidMount() {
				const { location } = router;
				if (location) {
					const { getOmitPaths } = modalStore;
					const query = omitBy(location.query, getOmitPaths);
					this._setQuery(query);
				}
			}

			componentWillUnmount() {
				this._removeQueryListener && this._removeQueryListener();
				this._unlistenHistory && this._unlistenHistory();
			}

			_setQuery(query) {
				const { store } = this.state;
				store.query = query;
			}

			render() {
				const { props, state } = this;
				return <WrappedComponent {...props} {...state} />;
			}
		}

		return hoistStatics(DataStoreProvider, WrappedComponent);
	};
}
