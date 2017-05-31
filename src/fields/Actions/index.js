
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import { Input } from 'antd';
import withField from 'utils/withField';

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
					{Children.map(children, (child) => cloneElement(child, {
						recordKey: record.key,
					}))}
				</div>
			);
		},
	};

	render() {
		return (<noscript />);
	}
}
