import React, { Component } from 'react';
import { Table as TableComp, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { observer, propTypes as MobxPropTypes } from 'mobx-react';
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
		location: MobxPropTypes.observableObject.isRequired,
		selectionType: PropTypes.oneOf(['checkbox', 'radio']),
	};

	static defaultProps = {
		selectionType: 'checkbox',
	};

	static contextTypes = {
		appConfig: PropTypes.object.isRequired,
	};

	_handleSelectChange = (selectedRowKeys) => {
		this.props.store.setSelectedKeys(selectedRowKeys);
	};

	_handlePageChange = (page) => {
		const { location } = this.props;
		location.query = { ...location.query, page };
	};

	_handleChange = (pagination, filters, sorter) => {
		const {
			context: {
				appConfig,
				appConfig: { api: { sortKey, orderKey, descValue, ascValue } },
			},
			props: { location },
		} = this;
		if (isEmpty(sorter)) {
			return clearSortedInfo(appConfig);
		}
		location.query = {
			...location.query,
			[sortKey]: sorter.columnKey,
			[orderKey]: sorter.order === 'descend' ? descValue : ascValue,
		};
	};

	render() {
		const { store, location, selectionType } = this.props;
		const {
			columns,
			dataSource,
			isFetching,
			total,
			size,
			selectedKeys,
			uniqueKey,
			maxSelections,
		} = store;

		const current = +location.query.page || 1;

		const rowSelection = maxSelections ?
			{
				type: selectionType,
				selectedRowKeys: selectedKeys,
				onChange: this._handleSelectChange,
				getCheckboxProps: (record) => ({
					disabled:
							selectionType === 'checkbox' &&
							maxSelections > 0 &&
							selectedKeys.length >= maxSelections &&
							selectedKeys.indexOf(record[uniqueKey]) < 0,
				}),
			} :
			undefined;

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
