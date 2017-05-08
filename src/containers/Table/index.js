
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getSchema from 'utils/getSchema';
import getStore from 'stores/Data';

import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';

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
	};

	getChildContext() {
		const { store } = this.state;
		return { store };
	}

	componentWillMount() {
		const { table } = this.props.route;
		this.state = {
			QueryComponent: getSchema(table, 'query'),
			ToolbarComponent: getSchema(table, 'toolbar'),
			store: getStore(table),
		};
	}

	componentWillReceiveProps({ route: { table } }) {
		if (this.props.route.table !== table) {
			this.setState({
				QueryComponent: getSchema(table, 'query'),
				ToolbarComponent: getSchema(table, 'toolbar'),
				store: getStore(table),
			});
		}
	}

	componentDidMount() {
		this._fetch();
	}

	componentDidUpdate(prevProps) {
		const { location } = this.props;
		if (prevProps.location !== location) {
			this._fetch();
		}
	}

	_updateQuery(query, shouldReplace) {
		const { router, location: { pathname, query: locQuery } } = this.props;
		router.push({
			pathname,
			query: shouldReplace ? query : { ...locQuery, ...query },
		});
	}

	_handleQuery = (query) => {
		this._updateQuery(query, true);
	};

	_fetch() {
		const { query, search } = this.props.location;
		this.state.store.fetch(query, search);
	}

	_handlePageChange = (page) => {
		this._updateQuery({ page });
	};

	render() {
		const {
			props: { location },
			state: {
				QueryComponent,
				ToolbarComponent,
				store,
			},
		} = this;

		return (
			<div>
				<TableQuery onQuery={this._handleQuery}>
					<QueryComponent />
				</TableQuery>

				<ToolbarComponent />

				<TableBody
					location={location}
					store={store}
					onPageChange={this._handlePageChange}
				/>
			</div>
		);
	}
}
