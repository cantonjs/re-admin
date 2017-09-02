
import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'components/Nested';
import Text from 'fields/Text';

export default class SelectField extends Component {
	static propTypes = {
		children: PropTypes.node,
		style: PropTypes.object,
	};

	static renderTable({ children }, { text }) {
		const options = Children.toArray(children);
		const option = options.find(({ props }) => props.value === text);
		return option ? <span>{option.props.children}</span> : null;
	}

	static defaultChildComponent = Select.Option;

	static minWidth = 96;

	state = {
		style: {
			minWidth: SelectField.minWidth,
			...this.props.style,
		},
	};

	componentWillReceiveProps({ style }) {
		if (this.props.style !== style) {
			this.setState({
				style: {
					minWidth: SelectField.minWidth,
					...style,
				},
			});
		}
	}

	render() {
		const { props, state } = this;

		return (
			<Text
				{...props}
				{...state}
				component={Select}
			/>
		);
	}
}
