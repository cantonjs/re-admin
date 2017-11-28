
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { Input } from 'antd';
import withField from 'utils/withField';

const renderChildren = (children, record) => {
	const finalChildren = [];
	const length = Children.count(children);
	Children.forEach(children, (child, index) => {
		finalChildren.push(cloneElement(child, {
			recordKeys: [record.key],
			key: `${index}@1`,
			record,
		}));

		if (index < length - 1) {
			finalChildren.push(<span className="ant-divider" key={`${index}@2`} />);
		}
	});
	return finalChildren;
};

@withField
export default class Actions extends Component {
	static propTypes = {
		component: PropTypes.component,
	};

	static defaultProps = {
		label: '自定义操作',
		component: Input,
		inTable: true,
	};

	static renderTable(props, { record }) {
		return (<div>{renderChildren(props.children, record)}</div>);
	}

	render() {
		return (<noscript />);
	}
}
