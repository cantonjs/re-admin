
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { Input } from 'antd';
import withField from 'utils/withField';

const renderChildren = (children, record) => {
	const finalChildren = [];
	const length = Children.count(children);
	Children.forEach(children, (child, index) => {
		finalChildren.push(cloneElement(child, {
			recordKey: record.key,
			record,
			key: `${index}@1`,
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
		name: '__actions__',
		label: '自定义操作',
		component: Input,
		shouldHideInForm: true,
		render: (value, record, index, { children }) => {
			return (
				<div>
					{renderChildren(children, record)}
				</div>
			);
		},
	};

	render() {
		return (<noscript />);
	}
}
