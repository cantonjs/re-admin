
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import { Input } from 'components/Nested';
import withField from 'utils/withField';

@withField
export default class TextField extends Component {
	static propTypes = {
		component: PropTypes.component,
		getValue: PropTypes.func.isRequired,
	};

	static defaultProps = {
		component: Input,
	};

	render() {
		const {
			props: {
				getValue,
				component: Comp,
				...other,
			},
		} = this;

		const value = getValue();
		return (
			<Comp
				{...other}
				defaultValue={value}
				value={value}
			/>
		);
	}
}
