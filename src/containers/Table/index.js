
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getComponents from 'utils/getComponents';
import getStore from 'stores/Data';
import { omit, isEqual } from 'lodash';

import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import ActionModal from 'components/ActionModal';

@observer
export default class Table extends Component {
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
		}),
	};

	static childContextTypes = {
		store: PropTypes.object,
		updateLocationQuery: PropTypes.func,
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
		this.state = {
			...getComponents(table),
			store: getStore(table),
		};
	}

	componentWillReceiveProps({ route: { table } }) {
		if (this.props.route.table !== table) {
			this.setState({
				...getComponents(table),
				store: getStore(table),
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
			const blackList = ['action', 'selectedKeys'];
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

	render() {
		const {
			props: { location },
			state: {
				DataComponent,
				QueryComponent,
				ToolbarComponent,
				store,
			},
		} = this;

		return (
			<div>
				<TableQuery onQuery={this.updateQuery}>
					{new QueryComponent().props.children}
				</TableQuery>

				<ToolbarComponent />

				<TableBody
					location={location}
					store={store}
					onPageChange={this._handlePageChange}
				/>

				<ActionModal
					location={location}
					store={store}
				>
					{new DataComponent().props.children}
				</ActionModal>
			</div>
		);
	}
}
