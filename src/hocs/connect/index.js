import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoist, { extractRef } from 'hocs/hoist';
import { withStoreProvider } from 'hocs/withStore';
import { observer } from 'mobx-react';
import { omitBy, isEqual } from 'lodash';
import ModalStore from 'stores/ModalStore';
import routerStore from 'stores/routerStore';

export default function connect(options = {}) {
	const { syncLocation, useCache } = options;
	const router = syncLocation ? routerStore : {};

	return function createConnectComponent(WrappedComponent) {
		@hoist(WrappedComponent)
		@withStoreProvider({ useCache })
		@observer
		class ConnectStore extends Component {
			static propTypes = {
				table: PropTypes.string,
				store: PropTypes.object,
			};

			// TODO:
			// static contextTypes = {
			// 	store: PropTypes.object,
			// };

			// static childContextTypes = {
			// 	store: PropTypes.object,
			// };

			// getChildContext() {
			// 	const { state: { store }, context } = this;
			// 	return {
			// 		store: store || (context && context.store),
			// 	};
			// }

			constructor(props, context) {
				super(props, context);
				const { store } = props;
				if (store) {
					this._removeQueryListener = store.addQueryListener(router);
				}
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

		return ConnectStore;
	};
}
