import React from 'react';
import PropTypes from 'prop-types';
import createComponent from './createComponent';
import {
	Input as AntdInput,
	Select as AntdSelect,
	Checkbox as AntdCheckbox,
	Upload as AntdUpload,
	Slider as AntdSlider,
	DatePicker as AntdDatePicker,
} from 'antd';

const {
	// MonthPicker: AntdMonthPicker,
	RangePicker: AntdRangePicker,
} = AntdDatePicker;

export Form from './Form';
export Submit from './Submit';
export Reset from './Reset';

export const Input = createComponent(AntdInput, {
	displayName: 'NestInput',
});

export const Slider = createComponent(AntdSlider, {
	displayName: 'NestSlider',
	onChange(value) {
		return value;
	},
});

export const Select = createComponent(AntdSelect, {
	displayName: 'NestSelect',
	onChange(value) {
		return value;
	},
});

export const DatePicker = createComponent(AntdDatePicker, {
	displayName: 'NestDatePicker',
	onChange(value) {
		return value;
	},
});

export const RangePicker = createComponent(AntdRangePicker, {
	displayName: 'NestRangePicker',
	onChange(value) {
		return value;
	},
});

export const Upload = createComponent(AntdUpload, {
	displayName: 'NestUpload',
	propTypes: {
		uploadName: PropTypes.string,
	},
	mapProps({ props }) {
		return {
			onChange({ fileList }) {
				return props.mapFileList ? props.mapFileList(fileList) : fileList;
			},
		};
	},
	render(props, originalProps, Comp) {
		return (
			// eslint-disable-next-line react/prop-types
			<Comp {...props} name={originalProps.uploadName || props.name} />
		);
	},
});

export const Checkbox = createComponent(AntdCheckbox, {
	displayName: 'NestCheckbox',
	mapProps() {
		return {
			value: {
				name: 'checked',
				get: (value, props) => {
					if (value === false) {
						return false;
					}
					if (value === true || props.checked) {
						return props.value || 'on';
					}
				},
			},
			defaultValue: {
				name: 'defaultChecked',
				get: (value, props) => {
					if (value === false) {
					}
					if (value === true || props.defaultChecked) {
						return props.value || 'on';
					}
				},
			},
			onChange: (ev) => ev.target.checked,
		};
	},
});
