import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { isFunction } from 'lodash';
import withStore from 'hocs/withStore';
import TableRowKeyContext from 'contexts/TableRowKey';

@withStore()
export default class ActionInternalView extends Component {
	static propTypes = {
		children: PropTypes.nodeOrFunc.isRequired,
		tableRowKey: PropTypes.string,
		store: PropTypes.object.isRequired,
	};

	_renderChildren({ children, tableRowKey, store }) {
		const list = isFunction(children) ?
			children(store.getData(tableRowKey)) :
			children;
		const childrenArr = [];
		const length = Children.count(list);
		Children.forEach(list, (child, index) => {
			childrenArr.push(cloneElement(child, { key: `${index}@1` }));
			if (index < length - 1) {
				childrenArr.push(<span className="ant-divider" key={`${index}@2`} />);
			}
		});
		return childrenArr;
	}

	render() {
		const { tableRowKey, ...restProps } = this.props;
		return (
			<TableRowKeyContext.Provider value={tableRowKey}>
				<div>{this._renderChildren(restProps)}</div>
			</TableRowKeyContext.Provider>
		);
	}
}
