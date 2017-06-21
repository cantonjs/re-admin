

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
	mapChange(onChange) {
		return (value) => {
			onChange(null, value);
		};
	},
});

export const Select = createComponent(AntdSelect, {
	displayName: 'NestSelect',
	mapChange(onChange) {
		return (value) => {
			onChange(null, value);
		};
	},
});

export const DatePicker = createComponent(AntdDatePicker, {
	displayName: 'NestDatePicker',
	mapChange(onChange) {
		return (date) => {
			onChange(null, date);
		};
	},
});

export const RangePicker = createComponent(AntdRangePicker, {
	displayName: 'NestRangePicker',
	mapChange(onChange) {
		return (date) => {
			onChange(null, date);
		};
	},
});

export const Upload = createComponent(AntdUpload, {
	displayName: 'NestUpload',
	mapChange(onChange) {
		return (ev) => {
			const { fileList } = ev;
			const value = fileList
				.filter(({ status }) => status === 'done')
				.map(({ thumbUrl, response }) => response.url || thumbUrl)
				.join(',')
			;
			onChange(ev, value);
		};
	},
});
