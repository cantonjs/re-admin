
import React, { Component } from 'react';
import { Table as TableComp, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import routerStore from 'stores/router';

const styles = {
	footer: {
		overflow: 'hidden',
	},
	total: {
		marginTop: 28,
		float: 'left',
		color: '#888',
	},
	pagination: {
		marginTop: 20,
		float: 'right',
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
	};

	_handleSelectChange = (selectedRowKeys) => {
		this.props.store.setSelectedKeys(selectedRowKeys);
	};

	_handlePageChange = (page) => {
		const { location } = routerStore;
		location.query = { ...location.query, page };
	}

	render() {
		const { store } = this.props;
		const {
			columns, dataSource, isFetching, total, size, selectedKeys
		} = store;

		const current = +routerStore.location.query.page || 1;

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

				<div style={styles.footer}>
					<p style={styles.total}>共 {total || 0} 条记录</p>

					<Pagination
						style={styles.pagination}
						current={current}
						total={total}
						onChange={this._handlePageChange}
						defaultPageSize={size}
					/>
				</div>
			</div>
		);
	}
}

