import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import ActionModalStore from 'stores/ActionModalStore';
import { omitBy, isEqual } from 'lodash';
import { parse } from 'tiny-querystring';

export default function dataStoreProvider() {
	return function createDataStoreProviderComponent(WrappedComponent) {
		@observer
		class DataStoreProvider extends Component {
			static propTypes = {
				location: PropTypes.shape({
					query: PropTypes.object,
					pathname: PropTypes.string,
					search: PropTypes.string,
				}),
				table: PropTypes.string,
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
				const { history } = routerStore;
				this._unlisten = history.listen((location, prevLocation) => {
					console.log('prevLocation.query', prevLocation.query);
					console.log('location.query', location.query);
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

			componentDidUpdate({ location: prevLocation }) {
				const { pathname, search } = this.props.location;

				if (location === prevLocation) {
					return;
				}

				if (prevLocation.pathname !== pathname) {
					this._fetch();
				} else if (prevLocation.search !== search) {
					const { getOmitPaths } = ActionModalStore;
					const originalPrevQuery = parse(prevLocation.search.slice(1));
					const prevQuery = omitBy(originalPrevQuery, getOmitPaths);
					const nextQuery = omitBy(routerStore.location.query, getOmitPaths);
					if (!isEqual(prevQuery, nextQuery)) {
						this._fetch();
					}
				}
			}

			componentWillUnmount() {
				this._unlisten();
			}

			_fetch() {
				const { query, search } = routerStore.location;
				this.state.store.fetch({ query, state: { cacheKey: search } });
			}

			getWrappedInstance() {
				return this.wrappedInstance;
			}

			render() {
				const { props, state } = this;
				return (
					<WrappedComponent
						{...props}
						{...state}
						ref={(c) => (this.wrappedInstance = c)}
					/>
				);
			}
		}

		return hoistStatics(DataStoreProvider, WrappedComponent);
	};
}
