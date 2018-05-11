import React, { Component, Children } from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';
import { Select } from 'components/Nested';
import Text from 'fields/Text';

@polyfill
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

	static getDerivedStateFromProps({ style }, { prevStyle }) {
		return style === prevStyle ?
			null :
			{
				prevStyle: style,
				style: {
					minWidth: SelectField.minWidth,
					...style,
				},
			};
	}

	constructor(props) {
		super(props);

		const prevStyle = props.style;
		this.state = {
			style: {
				minWidth: SelectField.minWidth,
				...prevStyle,
			},
			prevStyle,
		};
	}

	render() {
		const { props, state: { prevStyle, ...styleProps } } = this;
		return <Text {...props} {...styleProps} component={Select} />;
	}
}
