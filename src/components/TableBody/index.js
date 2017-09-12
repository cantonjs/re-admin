
import React, { Component } from 'react';
import { Table as TableComp, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import routerStore from 'stores/routerStore';
import { isEmpty } from 'lodash';
import clearSortedInfo from 'utils/clearSortedInfo';

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
		routerStore: PropTypes.object,
		noMulti: PropTypes.bool,
	};

	static defaultProps = {
		routerStore,
		noMulti: false,
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
	};

	_handleSelectChange = (selectedRowKeys) => {
		this.props.store.setSelectedKeys(selectedRowKeys);
	};

	_handlePageChange = (page) => {
		const { location } = this.props.routerStore;
		location.query = { ...location.query, page };
	}

	_handleChange = (pagination, filters, sorter) => {
		const {
			context: {
				appConfig,
				appConfig: { api: { sortKey, orderKey, descValue, ascValue } },
			},
			props: { routerStore },
		} = this;
		const { location } = routerStore;
		if (isEmpty(sorter)) {
			return clearSortedInfo(appConfig);
		}
		location.query = {
			...location.query,
			[sortKey]: sorter.columnKey,
			[orderKey]: sorter.order === 'descend' ? descValue : ascValue,
		};
	}

	render() {
		const { store, routerStore, noMulti } = this.props;
		const {
			columns, dataSource, isFetching, total, size, selectedKeys
		} = store;

		const current = +routerStore.location.query.page || 1;

		const rowSelection = {
			type: noMulti ? 'radio' : 'checkbox',
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
					onChange={this._handleChange}
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

