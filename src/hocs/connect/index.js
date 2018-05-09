import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import { observer } from 'mobx-react';
import ModalStore from 'stores/ModalStore';
import { omitBy, isEqual } from 'lodash';
import routerStore from 'stores/routerStore';

export default function connect(options = {}) {
	const { syncLocation, useCache } = options;
	const router = syncLocation ? routerStore : {};

	return function createConnectComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@observer
		class ConnectStore extends Component {
			static propTypes = {
				table: PropTypes.string,
			};

			static childContextTypes = {
				store: PropTypes.object,
			};

			static contextTypes = {
				storesDispatcher: PropTypes.object.isRequired,
				store: PropTypes.object,
			};

			getChildContext() {
				const { state: { store }, context } = this;
				return {
					store: store || context.store,
				};
			}

			constructor(props, context) {
				super(props, context);
				const { table } = props;
				const state = {};
				if (table) {
					const store = this._getStore(table);
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

			componentWillReceiveProps({ table }) {
				if (this.props.table && this.props.table !== table) {
					this.setState({
						store: this._getStore(table),
					});
				}
			}

			componentWillUnmount() {
				this._removeQueryListener && this._removeQueryListener();
				this._unlistenHistory && this._unlistenHistory();
			}

			_getStore(table) {
				const { context: { storesDispatcher } } = this;
				return storesDispatcher.ensureStore(table, { useCache });
			}

			_setQuery(query) {
				const { store } = this.state;
				store.query = query;
			}

			render() {
				const { props, state } = this;
				return <WrappedComponent {...extractRef(props)} {...state} />;
			}
		}

		return ConnectStore;
	};
}
