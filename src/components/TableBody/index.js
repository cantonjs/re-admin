import $$ from './style.scss';

import React, { Component } from 'react';
import { Table as TableComp, Pagination } from 'antd';
import PropTypes from 'prop-types';

export default class TableBody extends Component {

	static propTypes = {
		columns: PropTypes.array.isRequired,
		dataSource: PropTypes.array,
		isFetching: PropTypes.bool.isRequired,
		defaultCurrent: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
		onPageChange: PropTypes.func.isRequired,
		defaultPageSize: PropTypes.number.isRequired,
		selectedRowKeys: PropTypes.array.isRequired,
		onRowSelectChange: PropTypes.func.isRequired,
	};

	render() {
		const { onRowSelectChange, selectedRowKeys, columns, dataSource, isFetching, defaultCurrent, total, onPageChange, defaultPageSize } = this.props;
		const rowSelection = {
			selectedRowKeys,
			onChange: onRowSelectChange,
		};
		return (
			<div className={$$.container}>
				<TableComp
					rowSelection={rowSelection}
					columns={columns}
					dataSource={dataSource}
					loading={isFetching}
					pagination={false}
				/>
				<Pagination
					className={$$.page}
					defaultCurrent={defaultCurrent}
					total={total}
					onChange={onPageChange}
					defaultPageSize={defaultPageSize}
				/>
			</div>
		);
	}
}

