import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'components/Form';
import field from 'hocs/field';

@field
export default class CheckboxField extends Component {
	static propTypes = {
		renderToString: PropTypes.func,
		getValue: PropTypes.func.isRequired,
	};

	static renderTable({ renderToString }, { value }) {
		return (
			<span>
				{renderToString ? renderToString(value) : value ? 'yes' : 'no'}
			</span>
		);
	}

	render() {
		const { props: { getValue, ...other } } = this;
		const value = getValue();

		return <Checkbox format="boolean" {...other} defaultChecked={!!value} />;
	}
}
