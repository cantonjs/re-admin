
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nestify } from 'react-nested-form';
import { Form } from 'antd';
import { parseDataType } from 'utils/dataType';

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
			defaultValue: PropTypes.any,
			dataType: PropTypes.any,
		};

		static displayName = displayName;

		render() {
			const {
				nest: {
					value, errorMessage, isRequired, isPristine, onKeyPress, onChange,
				},
				label, labelCol, wrapperCol, colon, required, wrapperStyle,
				defaultValue, dataType,

				...other,
			} = this.props;

			const isValid = errorMessage || (!isPristine && isRequired);

			return (
				<Item
					label={label}
					labelCol={labelCol}
					wrapperCol={wrapperCol}
					colon={colon}
					required={required}
					validateStatus={isValid ? 'error' : 'success'}
					help={errorMessage}
					style={wrapperStyle}
				>
					<Comp
						onKeyPress={onKeyPress}
						{...other}
						onChange={mapChange ? mapChange(onChange) : onChange}
						defaultValue={parseDataType(defaultValue, dataType)}
						value={parseDataType(value, dataType)}
					/>
				</Item>
			);
		}
	}

	return nestify(NestedFormElement);
}
