import React, { PureComponent } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'prop-types';
import { Demon } from 'react-form-mobx';
import {
	Form,
	DatePicker as AntdDatePicker,
	TimePicker as AntdTimePicker,
} from 'antd';

const { Item } = Form;

export default class DateTimePicker extends PureComponent {
	static propTypes = {
		required: PropTypes.bool,
		label: PropTypes.node,
		labelCol: PropTypes.object,
		wrapperCol: PropTypes.object,
		colon: PropTypes.bool,
		wrapperStyle: PropTypes.object,
	};

	demonRef = createRef();

	_getValueFromChangeEvent = (value) => {
		return value;
	};

	getValue() {
		return this.demonRef.current.getValue();
	}

	setValue() {
		return this.demonRef.current.setValue();
	}

	setPristineValue() {
		return this.demonRef.current.setPristineValue();
	}

	render() {
		const {
			label,
			labelCol,
			wrapperCol,
			colon,
			required,
			wrapperStyle,
			...props
		} = this.props;

		return (
			<Demon
				forwardedProps={props}
				getValueFromChangeEvent={this._getValueFromChangeEvent}
				ref={this.demonRef}
			>
				{(forwardedProps, { isInvalid, isTouched, errorMessage }) => (
					<Item
						label={label}
						labelCol={labelCol}
						wrapperCol={wrapperCol}
						colon={colon}
						required={props.required}
						validateStatus={isInvalid ? 'error' : 'success'}
						help={isTouched && isInvalid ? errorMessage : ''}
						style={wrapperStyle}
					>
						<AntdDatePicker {...forwardedProps} />
						<AntdTimePicker {...forwardedProps} />
					</Item>
				)}
			</Demon>
		);
	}
}
