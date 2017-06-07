
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import { omit, isEqual } from 'lodash';

import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import ActionModal from 'components/ActionModal';
import Toolbar from 'components/Toolbar';

@observer
export default class DataTableView extends Component {
	static propTypes = {
		router: PropTypes.shape({
			push: PropTypes.func.isRequired,
		}),
		location: PropTypes.shape({
			query: PropTypes.object,
			pathname: PropTypes.string,
			search: PropTypes.string,
		}),
		route: PropTypes.shape({
			table: PropTypes.string.isRequired,
			title: PropTypes.string,
		}),
	};

	static childContextTypes = {
		store: PropTypes.object,
		updateLocationQuery: PropTypes.func,
	};

	static contextTypes = {
		appConfig: PropTypes.object,
		DataStore: PropTypes.func.isRequired,
	};

	getChildContext() {
		const { store } = this.state;
		return {
			store,
			updateLocationQuery: ::this.updateQuery,
		};
	}

	componentWillMount() {
		const { table } = this.props.route;
		const { DataStore } = this.context;
		this.state = {
			...this._getDataNodes(table),
			store: DataStore.get(table),
		};
	}

	componentWillReceiveProps({ route: { table } }) {
		const { DataStore } = this.context;
		if (this.props.route.table !== table) {
			this.setState({
				...this._getDataNodes(table),
				store: DataStore.get(table),
			});
		}
	}

	componentDidMount() {
		this._fetch();
	}

	componentDidUpdate({ location: prevLocation }) {
		const { pathname, query } = this.props.location;

		if (location === prevLocation) { return; }

		if (prevLocation.pathname !== pathname) {
			this._fetch();
		}
		else if (prevLocation.query !== location.query) {
			const blackList = ActionModal.omitPaths;
			const prevQuery = omit(prevLocation.query, blackList);
			const nextQuery = omit(query, blackList);
			if (!isEqual(prevQuery, nextQuery)) {
				this._fetch();
			}
		}
	}

	updateQuery = (newQuery, options = {}) => {
		const { shouldReplace, omitPaths } = options;
		const { router, location: { pathname, query: locQuery } } = this.props;
		let query = shouldReplace ? newQuery : { ...locQuery, ...newQuery };
		if (omitPaths) { query = omit(query, omitPaths); }
		router.push({ pathname, query });
	};

	_fetch() {
		const { query, search } = this.props.location;
		this.state.store.fetch(query, search);
	}

	_handlePageChange = (page) => {
		this.updateQuery({ page });
	};

	_getDataNodes(table) {
		const { appConfig } = this.context;
		const { data, title } = appConfig.tables[table];
		return {
			title,
			form: data.filter(({ props }) => !props.shouldHideInForm),
			query: data,
		};
	}

	render() {
		const {
			props: { location, route },
			state: {
				store,
				title,
				form,
				query,
			},
		} = this;

		const hasQueryFields = !!query.length;

		return (
			<div>
				<h1>{title || route.title || route.table}</h1>

				{hasQueryFields && panelsStore.isShowQuery &&
					<TableQuery onQuery={this.updateQuery}>
						{query}
					</TableQuery>
				}

				<Toolbar hasQueryFields={hasQueryFields} />

				<TableBody
					location={location}
					store={store}
					onPageChange={this._handlePageChange}
				/>

				<ActionModal
					location={location}
					store={store}
				>
					{form}
				</ActionModal>
			</div>
		);
	}
}
