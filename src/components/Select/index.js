
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Field from 'components/Field';

const { Option } = Select;

export default class SelectField extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	render() {
		const { props } = this;

		return (
			<Field
				// render={(value) => {
				// 	const options = Children.toArray(props.children);
				// 	const option = options.find(({ props }) => props.value === value);
				// 	return Children.only(option.props.children);
				// }}
				{...props}
				component={Select}
			/>
		);
	}
}
