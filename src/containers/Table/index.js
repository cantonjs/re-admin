
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getStore from 'utils/getStore';
import { Table as TableComp, Pagination } from 'antd';

const columns = [
	{
		dataIndex: 'id',
		title: 'ID',
	},
	{
		dataIndex: 'name',
		title: '姓名',
	},
	{
		dataIndex: 'touxiang',
		title: '头像',
	},
	{
		dataIndex: 'desc',
		title: '描述',
	},
	{
		dataIndex: 'score',
		title: '分数',
	},
	{
		dataIndex: 'gpa',
		title: 'GPA',
	},
	{
		dataIndex: 'birthday',
		title: '生日',
	}
];


@observer
export default class Table extends Component {
	static propTypes = {
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
		this.state.store.fetch();
	}

	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	}

	onPageChange(page) {
		this.state.store.fetch({page});
		this.state.store.setPage(page);
	}

	render() {
		const { store, loading, selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const hasSelected = selectedRowKeys.length > 0;
		return (
			<div>
				<h1>Table</h1>
				<TableComp rowSelection={rowSelection} columns={store.columns} dataSource={store.dataSource} loading={store.isFetching} pagination={false}/>
				<Pagination defaultCurrent={1} total={store.total} onChange={this.onPageChange} defaultPageSize={store.size}/>
			</div>
		);
	}
}
