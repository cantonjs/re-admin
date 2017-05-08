
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getStore from 'utils/getStore';
import { Table as TableComp, Pagination } from 'antd';
import { omit } from 'lodash';

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
		const { store, selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const hasSelected = selectedRowKeys.length > 0;
		return (
			<div>
				<h1>Table</h1>
				<TableComp
					rowSelection={rowSelection}
					columns={store.columns}
					dataSource={store.dataSource}
					loading={store.isFetching}
					pagination={false}
				/>
				<Pagination
					className={$$.page}
					defaultCurrent={1}
					total={store.total}
					onChange={this.onPageChange}
					defaultPageSize={store.size}
				/>
			</div>
		);
	}
}
