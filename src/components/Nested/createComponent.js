
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { nestify } from 'react-nested-form';
import { Form } from 'antd';
import { isFunction } from 'lodash';

const { Item } = Form;

export default function createComponent(Comp, options = {}) {
	const {
		displayName = 'NestElement',
		onChange,
		mapProps = {},
		...otherOptions,
	} = options;

	if (!isFunction(mapProps) && onChange) {
		mapProps.onChange = onChange;
	}

	class NestedFormElement extends Component {
		static propTypes = {
			nest: PropTypes.object.isRequired,
			required: PropTypes.bool,
			label: PropTypes.node,
			labelCol: PropTypes.object,
			wrapperCol: PropTypes.object,
			colon: PropTypes.bool,
			wrapperStyle: PropTypes.object,

			name: PropTypes.string, // injected by nestify

			// To prevent overide Upload component's `name` key
			uploadName: PropTypes.string,
		};

		static displayName = displayName;

		render() {
			const {
				nest: { errorMessage, isPristine },
				label, labelCol, wrapperCol, colon, required, wrapperStyle,
				name, uploadName,
				...other,
			} = this.props;

			const isInvalid = errorMessage && !isPristine;

			return (
				<Item
					label={label}
					labelCol={labelCol}
					wrapperCol={wrapperCol}
					colon={colon}
					required={required}
					validateStatus={isInvalid ? 'error' : 'success'}
					help={isInvalid ? errorMessage : ''}
					style={wrapperStyle}
				>
					<Comp {...other} name={uploadName || name} />
				</Item>
			);
		}
	};

	return nestify(mapProps, otherOptions)(NestedFormElement);
}
