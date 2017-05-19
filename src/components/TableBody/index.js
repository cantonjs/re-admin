
import React, { Component } from 'react';
import { Table as TableComp, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

const styles = {
	pagination: {
		marginTop: 20,
		textAlign: 'right',
	},
};

@observer
export default class TableBody extends Component {
	static propTypes = {
		store: PropTypes.shape({
			columns: PropTypes.array.isRequired,
			dataSource: PropTypes.array,
			isFetching: PropTypes.bool.isRequired,
			total: PropTypes.number.isRequired,
			size: PropTypes.number.isRequired,
			setSelectedKeys: PropTypes.func.isRequired,
		}),
		location: PropTypes.shape({
			query: PropTypes.object,
			pathname: PropTypes.string,
		}),
		onPageChange: PropTypes.func.isRequired,
	};

	_handleSelectChange = (selectedRowKeys) => {
		this.props.store.setSelectedKeys(selectedRowKeys);
	};

	render() {
		const { onPageChange, store, location } = this.props;
		const {
			columns, dataSource, isFetching, total, size, selectedKeys
		} = store;
		const current = +location.query.page || 1;
		const rowSelection = {
			selectedRowKeys: selectedKeys,
			onChange: this._handleSelectChange,
		};
		return (
			<div>
				<TableComp
					rowSelection={rowSelection}
					columns={columns}
					dataSource={dataSource}
					loading={isFetching}
					pagination={false}
				/>
				<Pagination
					style={styles.pagination}
					current={current}
					total={total}
					onChange={onPageChange}
					defaultPageSize={size}
				/>
			</div>
		);
	}
}

