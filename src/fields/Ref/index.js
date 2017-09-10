
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import withField from 'utils/withField';
import RefSelector from 'components/RefSelector';

@withField
export default class RefField extends Component {
	static propTypes = {
		getValue: PropTypes.func.isRequired,
	};

	static defaultProps = {};

	render() {
		const {
			props: {
				getValue,
				...other,
			},
		} = this;

		const value = getValue();

		return (
			<RefSelector
				{...other}
				defaultValue={value}
				value={value}
			/>
		);
	}
}
