
import React from 'react';
import createComponent from './createComponent';
import {
	Input as AntdInput,
	Select as AntdSelect,
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
	onChange(value) { return value; },
});

export const Select = createComponent(AntdSelect, {
	displayName: 'NestSelect',
	onChange(value) { return value; },
});

export const DatePicker = createComponent(AntdDatePicker, {
	displayName: 'NestDatePicker',
	onChange(value) { return value; },
});

export const RangePicker = createComponent(AntdRangePicker, {
	displayName: 'NestRangePicker',
	onChange(value) { return value; },
});

export const Upload = createComponent(AntdUpload, {
	displayName: 'NestUpload',
	mapProps({ props }) {
		return {
			onChange({ fileList }) {
				console.log('onchange', props.mapFileList(fileList));
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
