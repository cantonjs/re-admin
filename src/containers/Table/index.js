
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getSchema from 'utils/getSchema';
import getStore from 'stores/Data';
import { pick } from 'lodash';

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
		}),
		route: PropTypes.shape({
			table: PropTypes.string.isRequired,
		}),
	};

	componentWillMount() {
		const { table } = this.props.route;
		const dataSchema = getSchema(table, 'data');
		const QueryComponent = getSchema(table, 'query');
		this.state = {
			QueryComponent,
			tableStore: getStore(dataSchema),
			selectedRowKeys: [],	// Check here to configure the default column
		};
	}

	componentWillReceiveProps({ route: { table } }) {
		if (this.props.route.table !== table) {
			this.setState({ tableStore: getStore(getSchema(table)) });
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

	_query = (query, pickPaths = []) => {
		const { router, location: { pathname, query: locQuery } } = this.props;
		query = { ...locQuery, ...query };
		if (pickPaths.length) { query = pick(query, pickPaths); }
		router.push({ pathname, query });
	};

	_fetch() {
		this.state.tableStore.fetch(this.props.location.query);
	}

	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	onPageChange = (page) => {
		this._query({ page });
	};

	render() {
		const {
			props: {
				route: { table },
				location,
			},
			state: { QueryComponent, tableStore, selectedRowKeys },
		} = this;
		const hasSelected = selectedRowKeys.length > 0;
		return (
			<div>
				<h1>Table</h1>
				<TableQuery onQuery={this._query}>
					<QueryComponent />
				</TableQuery>
				<TableBody
					location={location}
					store={tableStore}
					onPageChange={this.onPageChange}
					selectedRowKeys={selectedRowKeys}
					onRowSelectChange={this.onSelectChange}
				/>
			</div>
		);
	}
}
