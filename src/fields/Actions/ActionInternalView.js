import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { isFunction } from 'lodash';
import withStore from 'hocs/withStore';

@withStore()
export default class ActionInternalView extends Component {
	static propTypes = {
		children: PropTypes.nodeOrFunc.isRequired,
		tableRowKey: PropTypes.string,
		store: PropTypes.object.isRequired,
	};

	static childContextTypes = {
		tableRowKey: PropTypes.string,
	};

	getChildContext() {
		return {
			tableRowKey: this.props.tableRowKey,
		};
	}

	_renderChildren() {
		const { props: { children, tableRowKey, store } } = this;
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
		return <div>{this._renderChildren()}</div>;
	}
}
