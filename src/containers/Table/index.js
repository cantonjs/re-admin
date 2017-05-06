
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import getStore from 'utils/getStore';
import { Table as TableComp, pagination } from 'antd';

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
		stores: getStore(this.props.route.table),
		selectedRowKeys: [],	// Check here to configure the default column
		loading: false,
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
		this.state.stores.fetch();
	}

	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	}

	render() {
		const { stores, loading, selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const hasSelected = selectedRowKeys.length > 0;
		return (
			<div>
				<h1>Table</h1>
				<TableComp rowSelection={rowSelection} columns={stores.columns} dataSource={stores.dataSource} loading={stores.isFetching} pagination={false}/>
			</div>
		);
	}
}
