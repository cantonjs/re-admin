
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getStore from 'utils/getStore';
import { omit } from 'lodash';

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

	state = {
		store: getStore(this.props.route.table),
		selectedRowKeys: [],	// Check here to configure the default column
	};

	componentWillMount() {
		console.log('table:', this.props.route.table);
	}

	componentWillReceiveProps({ route: { table } }) {
		if (this.props.route.table !== table) {
			console.log('table:', table);
			this.setState({ store: getStore(table) });
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

	_query(newQuery, omitPaths = []) {
		const { router, location: { pathname, query } } = this.props;
		router.push({
			pathname,
			query: omit({
				...query,
				...newQuery,
			}, omitPaths),
		});
	}

	_fetch() {
		this.state.store.fetch(this.props.location.query);
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
				location: { query: { page = 1 } },
				route: { table },
				location,
			},
			state: { store, selectedRowKeys },
		} = this;
		const hasSelected = selectedRowKeys.length > 0;
		return (
			<div>
				<h1>Table</h1>
				<TableQuery
					table={table}
				/>
				<TableBody
					location={location}
					store={store}
					defaultCurrent={+page}
					onPageChange={this.onPageChange}
					selectedRowKeys={selectedRowKeys}
					onRowSelectChange={this.onSelectChange}
				/>
			</div>
		);
	}
}
