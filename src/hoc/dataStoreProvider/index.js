import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import ActionModalStore from 'stores/ActionModalStore';
import { omitBy, isEqual } from 'lodash';

export default function dataStoreProvider() {
	return function createDataStoreProviderComponent(WrappedComponent) {
		@observer
		class DataStoreProvider extends Component {
			static propTypes = {
				routerStore: PropTypes.shape({
					location: PropTypes.shape({
						query: PropTypes.object,
						pathname: PropTypes.string,
						search: PropTypes.string,
					}),
					history: PropTypes.shape({
						listen: PropTypes.func,
					}),
				}),
				table: PropTypes.string,
			};

			static defaultProps = {
				routerStore,
			};

			static childContextTypes = {
				store: PropTypes.object,
			};

			static contextTypes = {
				appConfig: PropTypes.object,
				DataStore: PropTypes.func.isRequired,
			};

			getChildContext() {
				return {
					store: this.state.store,
				};
			}

			constructor(props, context) {
				super(props, context);
				const { table } = props;
				const { DataStore } = context;
				this.state = {
					store: DataStore.get(table),
				};
			}

			componentWillMount() {
				const { history } = this.props.routerStore;
				this._unlisten = history.listen((location, prevLocation) => {
					if (location.pathname === prevLocation.pathname) {
						const { getOmitPaths } = ActionModalStore;
						const prevQuery = omitBy(prevLocation.query, getOmitPaths);
						const nextQuery = omitBy(location.query, getOmitPaths);
						if (!isEqual(prevQuery, nextQuery)) {
							this._fetch();
						}
					}
				});
			}

			componentWillReceiveProps({ table }) {
				const { DataStore } = this.context;
				if (this.props.table && this.props.table !== table) {
					this.setState({
						store: DataStore.get(table),
					});
				}
			}

			componentDidMount() {
				this._fetch();
			}

			componentWillUnmount() {
				this._unlisten();
			}

			_fetch() {
				const { query, search } = this.props.routerStore.location;
				this.state.store.fetch({ query, state: { cacheKey: search } });
			}

			render() {
				const { props, state } = this;
				return <WrappedComponent {...props} {...state} />;
			}
		}

		return hoistStatics(DataStoreProvider, WrappedComponent);
	};
}
