
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

export default class ActionInternalView extends Component {
	static propTypes = {
		children: PropTypes.node,
		tableRowKey: PropTypes.string,
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
		const { children } = this.props;
		const finalChildren = [];
		const length = Children.count(children);
		Children.forEach(children, (child, index) => {
			finalChildren.push(cloneElement(child, { key: `${index}@1` }));
			if (index < length - 1) {
				finalChildren.push(<span className="ant-divider" key={`${index}@2`} />);
			}
		});
		return finalChildren;
	}

	render() {
		return (
			<div>{this._renderChildren()}</div>
		);
	}
}
