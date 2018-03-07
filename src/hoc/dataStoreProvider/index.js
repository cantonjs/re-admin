import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import modalStore from 'stores/modalStore';
import { omitBy, isEqual } from 'lodash';
import routerStore from 'stores/routerStore';

export default function dataStoreProvider(options = {}) {
	const { bindLocation, storeType = 'list', storeName } = options;
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
				store: PropTypes.object,
				service: PropTypes.object,
			};

			getChildContext() {
				const { state: { store, service }, context } = this;
				return {
					store: store || context.store,
					service: service || context.service,
				};
			}

			constructor(props, context) {
				super(props, context);
				const { table } = props;
				const state = {};
				if (table) {
					const { DataStore } = context;
					const service = DataStore.get(table);
					const store = this._getStore(service);
					state.service = service;
					state.store = store;
					this._removeQueryListener = store.addQueryListener(router);
				}
				this.state = state;
			}

			componentWillMount() {
				const { history } = router;
				if (this.props.table && history) {
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

			componentDidMount() {
				const { location } = router;
				if (this.props.table && location) {
					const { getOmitPaths } = modalStore;
					const query = omitBy(location.query, getOmitPaths);
					this._setQuery(query);
				}
			}

			componentWillReceiveProps({ table }) {
				const { DataStore } = this.context;
				if (this.props.table && this.props.table !== table) {
					const service = DataStore.get(table);
					this.setState({
						store: this._getStore(service),
						service,
					});
				}
			}

			componentWillUnmount() {
				this._removeQueryListener && this._removeQueryListener();
				this._unlistenHistory && this._unlistenHistory();
			}

			_getStore(service) {
				return service.getStore(storeType, storeName);
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
