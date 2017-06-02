
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nestify } from 'react-nested-form';
import { Form } from 'antd';

const { Item } = Form;

export default function createComponent(Comp, options = {}) {

	const {
		displayName = 'NestedFormElement',
		mapChange,
	} = options;

	class NestedFormElement extends Component {
		static propTypes = {
			nest: PropTypes.object.isRequired,
			required: PropTypes.bool,
			label: PropTypes.node,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			colon: PropTypes.bool,
			wrapperStyle: PropTypes.object,
		};

		static displayName = displayName;

		render() {
			const {
				nest: {
					value, errorMessage, isRequired, isPristine, onKeyPress, onChange,
				},
				label, labelCol, wrapperCol, colon, required, wrapperStyle,
				...other,
			} = this.props;

			const isValid = errorMessage || (!isPristine && isRequired);

			return (
				<Item
					label={label}
					required={required}
					validateStatus={isValid ? 'error' : 'success'}
					help={errorMessage}
					style={wrapperStyle}
				>
					<Comp
						onKeyPress={onKeyPress}
						{...other}
						onChange={mapChange ? mapChange(onChange) : onChange}
						value={value}
					/>
				</Item>
			);
		}
	}

	return nestify(NestedFormElement);
}
