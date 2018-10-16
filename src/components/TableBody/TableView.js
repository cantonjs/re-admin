import React, { Component } from 'react';
import { Table as TableComp } from 'antd';
import PropTypes from 'utils/PropTypes';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import clearSortedInfo from 'utils/clearSortedInfo';
import { TABLE } from 'utils/Issuers';
import withIssuer from 'hocs/withIssuer';
import TableCell from './TableCell';
import TableHeadCell from './TableHeadCell';

const components = {
	header: { cell: TableHeadCell },
	body: { cell: TableCell },
};

@withIssuer({ issuer: TABLE })
@observer
export default class TableView extends Component {
	static propTypes = {
		store: PropTypes.shape({
			columns: PropTypes.array.isRequired,
			collection: PropTypes.array,
			isFetching: PropTypes.bool.isRequired,
			total: PropTypes.number.isRequired,
			size: PropTypes.number.isRequired,
			setSelectedKeys: PropTypes.func.isRequired,
			query: PropTypes.object.isRequired,
			config: PropTypes.object.isRequired,
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
		const { props: { store, selectionType } } = this;
		const {
			columns,
			collection,
			isFetching,
			selectedKeys,
			uniqueKey,
			maxSelections,
			config,
		} = store;
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
			<TableComp
				rowSelection={rowSelection}
				columns={columns}
				dataSource={toJS(collection)}
				loading={isFetching}
				pagination={false}
				components={components}
				onChange={this._handleChange}
				size={config.viewSize}
			/>
		);
	}
}
