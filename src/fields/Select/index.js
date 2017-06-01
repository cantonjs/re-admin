
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'components/Nested';
import Text from 'fields/Text';

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

	static defaultChildComponent = Select.Option;

	render() {
		const { props } = this;

		return (
			<Text
				{...props}
				component={Select}
			/>
		);
	}
}
