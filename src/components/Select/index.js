
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import Field from 'components/Field';

export default class SelectField extends Component {
	static propTypes = {
		children: PropTypes.node,
	};

	static defaultProps = {
		render: (value, records, index, { children }) => {
			const options = Children.toArray(children);
			const option = options.find(({ props }) => props.value === value);
			return option ? <span>{option.props.children}</span> : null;
		},
	};

	render() {
		const { props } = this;

		return (
			<Field
				{...props}
				component={Select}
			/>
		);
	}
}
