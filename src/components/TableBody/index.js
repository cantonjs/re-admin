import React, { Component } from 'react';
import { Table as TableComp, Pagination } from 'antd';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import clearSortedInfo from 'utils/clearSortedInfo';
import { TABLE } from 'utils/Issuers';
import localize from 'hocs/localize';
import withIssuer from 'hocs/withIssuer';
import TableCell from './TableCell';
import TableHeadCell from './TableHeadCell';

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

const components = {
	header: { cell: TableHeadCell },
	body: { cell: TableCell },
};

@withIssuer({ issuer: TABLE })
@localize()
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
			query: PropTypes.object.isRequired,
		}),
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
		const { store } = this.props;
		store.setQuery({ ...store.query, page });
	};

	_handleChange = (pagination, filters, sorter) => {
		const {
			context: {
				appConfig,
				appConfig: { api: { sortKey, orderKey, descValue, ascValue } },
			},
			props: { store },
		} = this;
		if (isEmpty(sorter)) {
			return clearSortedInfo(appConfig);
		}
		store.setQuery({
			...store.query,
			[sortKey]: sorter.columnKey,
			[orderKey]: sorter.order === 'descend' ? descValue : ascValue,
		});
	};

	render() {
		const { props: { store, selectionType }, locale } = this;
		const {
			columns,
			dataSource,
			isFetching,
			total,
			size,
			selectedKeys,
			uniqueKey,
			maxSelections,
			query,
		} = store;

		const current = +query.page || 1;

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
					components={components}
					onChange={this._handleChange}
					size="middle"
				/>

				<div style={styles.footer}>
					<p style={styles.total}>
						{locale.total}: {total || 0}
					</p>

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
