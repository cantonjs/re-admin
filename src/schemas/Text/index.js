
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Input } from 'antd';
import withField from 'utils/withField';

@withField
export default class TextField extends Component {
	static propTypes = {
		component: PropTypes.component,
		validator: PropTypes.array,
		getValue: PropTypes.func.isRequired,
		getFieldDecorator: PropTypes.func.isRequired,
	};

	static defaultProps = {
		component: Input,
	};

	render() {
		const {
			props: {
				getValue,
				getFieldDecorator,
				component: Comp,
				validator,
				...other,
			},
		} = this;

		const decorator = getFieldDecorator({
			initialValue: getValue(),
			rules: validator,
		});

		return (
			decorator(
				<Comp {...other} />
			)
		);
	}
}
