import createComponent from './createComponent';
import {
	Input as AntdInput,
	Select as AntdSelect,
	Checkbox as AntdCheckbox,
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
export Clear from './Clear';
export Upload from './Upload';

export const Input = createComponent(AntdInput, {
	displayName: 'Input',
});

export const Slider = createComponent(AntdSlider, {
	displayName: 'Slider',
	getValueFromChangeEvent(value) {
		return value;
	},
});

export const Select = createComponent(AntdSelect, {
	displayName: 'Select',
	getValueFromChangeEvent(value) {
		return value;
	},
});

export const DatePicker = createComponent(AntdDatePicker, {
	displayName: 'DatePicker',
	defaultProps: {
		defaultValue: undefined,
	},
	mapForwardedProps(props) {
		const { dateFormat, ...other } = props;
		return { ...other, format: dateFormat };
	},
	getValueFromChangeEvent(value) {
		return value;
	},
});

export const RangePicker = createComponent(AntdRangePicker, {
	displayName: 'RangePicker',
	defaultProps: {
		defaultValue: undefined,
	},
	getValueFromChangeEvent(value) {
		return value;
	},
});

export const Checkbox = createComponent(AntdCheckbox, {
	displayName: 'Checkbox',
	checkable: true,
	getCheckedFromChangeEvent({ target }) {
		return target.checked;
	},
});
