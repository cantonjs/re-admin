

import createComponent from './createComponent';
import {
	Input as AntdInput,
	Select as AntdSelect,
	Upload as AntdUpload,
} from 'antd';

export Form from './Form';
export Submit from './Submit';
export Reset from './Reset';

export const Input = createComponent(AntdInput, {
	displayName: 'NestedInput',
});

export const Select = createComponent(AntdSelect, {
	displayName: 'NestedSelect',
	mapChange(onChange) {
		return (value) => {
			onChange(null, value);
		};
	},
});

export const Upload = createComponent(AntdUpload, {
	displayName: 'NestedUpload',
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
